#include "../../../archi/src/DocumentSync.h"
#include <QTemporaryDir>
#include <QProcess>
#include <QProcessEnvironment>
#include <QtTest>
#include <memory>

class SyncTests : public QObject {
    Q_OBJECT
    std::unique_ptr<QTemporaryDir> dir;
    std::unique_ptr<DocumentSync> sync;
    QString project;
    QString notes;
    QString reference;
    QByteArray original;

    void put(const QString &path, const QByteArray &bytes) {
        QSaveFile file(path);
        QVERIFY(file.open(QIODevice::WriteOnly));
        QCOMPARE(file.write(bytes), bytes.size());
        QVERIFY(file.commit());
    }
    QByteArray get(const QString &path) {
        QFile file(path);
        if (!file.open(QIODevice::ReadOnly)) return {};
        return file.readAll();
    }
    QVariantMap row(const QString &path) {
        for (const auto &entry : sync->report().value("files").toList())
            if (entry.toMap().value("path").toString() == path) return entry.toMap();
        return {};
    }
    QString token(const QString &path) { return row(path).value("token").toString(); }
    QString state(const QString &path) { return row(path).value("state").toString(); }
    void link(const QString &path, const QString &role = "notes") {
        const auto result = sync->linkDocument(QUrl::fromLocalFile(path), role);
        QVERIFY2(result.value("ok").toBool(), qPrintable(result.value("error").toString()));
    }
    void confirm(const QString &path) {
        const auto result = sync->confirmAlignment(path, token(path));
        QVERIFY2(result.value("ok").toBool(), qPrintable(result.value("error").toString()));
    }
    void track(const QByteArray &raw) { sync->track(QUrl::fromLocalFile(project), QString::fromUtf8(raw), QString::fromUtf8(raw)); }
    QByteArray editLabel(const QByteArray &raw, const QString &label) {
        auto board = QJsonDocument::fromJson(raw).object();
        auto views = board["views"].toArray();
        auto view = views[0].toObject();
        auto shapes = view["shapes"].toArray();
        auto shape = shapes[0].toObject();
        shape["text"] = label;
        shapes[0] = shape; view["shapes"] = shapes; views[0] = view; board["views"] = views;
        return QJsonDocument(board).toJson();
    }
private slots:
    void init() {
        sync.reset();
        dir = std::make_unique<QTemporaryDir>();
        QVERIFY(dir->isValid());
        project = dir->filePath("project.archi.json");
        notes = dir->filePath("notes.md");
        reference = dir->filePath("reference.md");
        original = R"JSON({"format":"archi-brainstorm","version":1,"title":"Test project","activeView":"main","backgroundColor":"#caffee","views":[{"id":"main","title":"Main","notes":"Analysis","shapes":[{"shapeId":1,"text":"Read source","shapeKind":"process","nodeKey":"READ-01","description":"Read a permitted source.","pseudocode":"read_source()","px":1,"py":1,"pw":160,"ph":80,"shapeColor":"#fff"},{"shapeId":2,"text":"Finish","shapeKind":"terminal","nodeKey":"READ-02","description":"Return","pseudocode":"return","px":220,"py":1,"pw":160,"ph":80,"shapeColor":"#fff"}],"arrows":[{"fromId":1,"toId":2,"label":"done"}]}]})JSON";
        put(project, original);
        put(notes, "# Notes\n\nRead only.\n");
        put(reference, "# Original reference\n");
        sync = std::make_unique<DocumentSync>();
        track(original);
    }
    void statesAndPerDocumentReview() {
        link(notes); link(reference, "reference");
        QCOMPARE(state(notes), "unreviewed");
        confirm(notes);
        QCOMPARE(state(notes), "current");
        QCOMPARE(state(reference), "unreviewed");
        put(notes, "# Notes\n\nRevised document.\n");
        sync->refresh();
        QCOMPARE(state(notes), "document-changed");
        const auto revised = editLabel(original, "Inspect source");
        put(project, revised); track(revised);
        QCOMPARE(state(notes), "both-changed");
        confirm(notes);
        QCOMPARE(state(notes), "current");
        sync = std::make_unique<DocumentSync>();
        track(revised);
        QCOMPARE(state(notes), "current");
        QCOMPARE(state(reference), "unreviewed");
    }
    void draftsAndUndo() {
        link(notes); confirm(notes);
        sync->updateDraft(QString::fromUtf8(editLabel(original, "Unsaved change")));
        QCOMPARE(state(notes), "board-changed");
        QVERIFY(sync->report().value("unsaved").toBool());
        QVERIFY(!sync->confirmAlignment(notes, token(notes)).value("ok").toBool());
        sync->updateDraft(QString::fromUtf8(original));
        QCOMPARE(state(notes), "current");
        QVERIFY(!sync->report().value("unsaved").toBool());
    }
    void ignoresLayoutButNotStructure() {
        auto data = QJsonDocument::fromJson(original).object();
        data["backgroundColor"] = "#000000";
        data["activeView"] = "other";
        auto views = data["views"].toArray();
        auto view = views[0].toObject();
        view["viewport"] = QJsonObject{{"x", 999}, {"zoom", 3}};
        auto shapes = view["shapes"].toArray();
        auto shape = shapes[0].toObject();
        shape["px"] = 999; shape["shapeColor"] = "#ff0000"; shape["pw"] = 999;
        shapes[0] = shape; view["shapes"] = shapes;
        auto arrows = view["arrows"].toArray();
        auto edge = arrows[0].toObject();
        edge["points"] = QJsonArray{QJsonObject{{"x", 2}, {"y", 3}}}; edge["labelX"] = 88;
        arrows[0] = edge; view["arrows"] = arrows; views[0] = view; data["views"] = views;
        QCOMPARE(DocumentSync::semanticBoard(QJsonDocument(data).toJson()), DocumentSync::semanticBoard(original));
        edge["label"] = "different condition"; arrows[0] = edge; view["arrows"] = arrows; views[0] = view; data["views"] = views;
        QVERIFY(DocumentSync::semanticBoard(QJsonDocument(data).toJson()) != DocumentSync::semanticBoard(original));
    }
    void rejectsStaleReviewsAndExternalBoardEdits() {
        link(notes); confirm(notes);
        const auto stale = token(notes);
        put(notes, "Changed after review opened");
        QVERIFY(!sync->confirmAlignment(notes, stale).value("ok").toBool());
        QCOMPARE(state(notes), "document-changed");
        const auto revised = editLabel(original, "External board edit");
        put(project, revised);
        sync->refresh();
        QVERIFY(!sync->report().value("error").toString().isEmpty());
        QVERIFY(!sync->confirmAlignment(notes, token(notes)).value("ok").toBool());
        track(revised);
        QCOMPARE(state(notes), "both-changed");
    }
    void filesystemWatchSurvivesReplacementAndDeletion() {
        link(notes); confirm(notes);
        put(notes, "Atomic replacement");
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "document-changed", 2500);
        confirm(notes);
        QVERIFY(QFile::remove(notes));
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "unavailable", 2500);
        put(notes, "Recreated document");
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "document-changed", 2500);
        confirm(notes);
        put(notes, "Another replacement");
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "document-changed", 2500);
    }
    void referencePreviewAndBackup() {
        link(reference, "reference");
        const auto prior = get(reference);
        auto preview = sync->previewReference(reference);
        QVERIFY(preview.value("ok").toBool());
        QCOMPARE(get(reference), prior);
        QVERIFY(preview.value("proposed").toString().contains("### READ-01: Read source"));
        QVERIFY(preview.value("proposed").toString().contains("ON done -> READ-02"));
        QVERIFY(preview.value("proposed").toString().contains("read_source()"));
        put(reference, "Manual edit after preview");
        QVERIFY(!sync->writeReference(reference, preview.value("token").toString()).value("ok").toBool());
        QCOMPARE(get(reference), QByteArray("Manual edit after preview"));
        preview = sync->previewReference(reference);
        QVERIFY(sync->writeReference(reference, preview.value("token").toString()).value("ok").toBool());
        QCOMPARE(get(reference + ".sync.bak"), QByteArray("Manual edit after preview"));
        QCOMPARE(get(reference), preview.value("proposed").toString().toUtf8());
        QCOMPARE(state(reference), "current");
        link(notes);
        QVERIFY(!sync->previewReference(notes).value("ok").toBool());
    }
    void unlinkAndProjectIsolation() {
        link(notes); confirm(notes);
        const auto contents = get(notes);
        QVERIFY(sync->unlinkDocument(notes, token(notes)).value("ok").toBool());
        QCOMPARE(get(notes), contents);
        QVERIFY(sync->report().value("files").toList().isEmpty());
        link(notes); confirm(notes);
        const auto second = dir->filePath("second.json");
        put(second, original);
        sync->track(QUrl::fromLocalFile(second), QString::fromUtf8(original), QString::fromUtf8(original));
        QVERIFY(sync->report().value("files").toList().isEmpty());
        track(original);
        QCOMPARE(state(notes), "current");
    }
    void invalidManifestsAndLimits() {
        link(notes);
        put(project + ".sync.json", "{broken");
        sync->refresh();
        QVERIFY(!sync->report().value("error").toString().isEmpty());
        QVERIFY(!sync->linkDocument(QUrl::fromLocalFile(reference), "reference").value("ok").toBool());
        QCOMPARE(get(project + ".sync.json"), QByteArray("{broken"));
        QVERIFY(QFile::remove(project + ".sync.json"));
        sync->refresh();
        put(notes, QByteArray(4 * 1024 * 1024 + 1, 'x'));
        QVERIFY(!sync->linkDocument(QUrl::fromLocalFile(notes)).value("ok").toBool());
        QVERIFY(!sync->linkDocument(QUrl("https://example.com/notes.md")).value("ok").toBool());
        QVERIFY(!sync->linkDocument(QUrl::fromLocalFile(project)).value("ok").toBool());
    }
    void commandLineNeedsNoDisplay() {
        link(notes);
        QProcess process;
        auto environment = QProcessEnvironment::systemEnvironment();
        environment.insert("QT_QPA_PLATFORM", "not-a-real-display-plugin");
        process.setProcessEnvironment(environment);
        process.start("/home/ethan/archi/build/archi", {"--sync-status", project});
        QVERIFY(process.waitForFinished(5000));
        QCOMPARE(process.exitCode(), 2);
        auto result = QJsonDocument::fromJson(process.readAllStandardOutput()).object();
        QCOMPARE(result.value("attention").toInt(), 1);
        confirm(notes);
        process.start("/home/ethan/archi/build/archi", {"--sync-status", project});
        QVERIFY(process.waitForFinished(5000));
        QCOMPARE(process.exitCode(), 0);
        put(project + ".sync.json", "not json");
        process.start("/home/ethan/archi/build/archi", {"--sync-status", project});
        QVERIFY(process.waitForFinished(5000));
        QCOMPARE(process.exitCode(), 1);
    }
};

QTEST_GUILESS_MAIN(SyncTests)
#include "test_sync.moc"
