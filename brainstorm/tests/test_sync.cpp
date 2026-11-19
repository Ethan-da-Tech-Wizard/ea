// ==============================================================================
// Program: test_sync.cpp
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 19, 2026
// Purpose: C++ automated integration test suite validating DocumentSync state machines,
//          cryptographic content hashing, draft change tracking, and file reconciliation.
//          Verifies transactional synchronization between JSON board models and external
//          Markdown documentation, testing atomic filesystem writes, change tokens,
//          conflict detection, and headless CLI sync status verification without X11/Wayland display.
// ==============================================================================

#include "../../../archi/src/DocumentSync.h"
#include <QTemporaryDir>
#include <QProcess>
#include <QProcessEnvironment>
#include <QtTest>
#include <memory>

/**
 * Headless C++ test harness exercising the full lifecycle of DocumentSync contracts.
 * 
 * Safety & Invariant Guarantees:
 *   - Each test iteration executes within an isolated QTemporaryDir sandbox to prevent state pollution.
 *   - State transition tokens guarantee that user confirmations apply only to specific file snapshots.
 *   - Semantic board hashing ensures cosmetic edits (color, zoom, coordinates) do not trigger stale reviews.
 */
class SyncTests : public QObject {
    Q_OBJECT
    
    // Test fixture resources and sandboxed filesystem paths
    std::unique_ptr<QTemporaryDir> dir;
    std::unique_ptr<DocumentSync> sync;
    QString project;
    QString notes;
    QString reference;
    QByteArray original;

    /**
     * Atomically writes byte payload to disk via QSaveFile to prevent partial write corruption.
     * 
     * @param path Absolute target destination path.
     * @param bytes Binary payload buffer.
     */
    void put(const QString &path, const QByteArray &bytes) {
        QSaveFile file(path);
        QVERIFY(file.open(QIODevice::WriteOnly));
        QCOMPARE(file.write(bytes), bytes.size());
        QVERIFY(file.commit());
    }

    /**
     * Reads entire file contents from disk into a QByteArray buffer.
     * 
     * @param path Target filesystem path.
     * @return Complete file payload or empty byte array on failure.
     */
    QByteArray get(const QString &path) {
        QFile file(path);
        if (!file.open(QIODevice::ReadOnly)) return {};
        return file.readAll();
    }

    /**
     * Retrieves the synchronization metadata record for a given document path.
     * 
     * @param path Target document path to search within active sync report.
     * @return Variant map containing document sync properties (state, token, hash).
     */
    QVariantMap row(const QString &path) {
        for (const auto &entry : sync->report().value("files").toList())
            if (entry.toMap().value("path").toString() == path) return entry.toMap();
        return {};
    }

    /**
     * Extracts the cryptographic alignment token for a specific document path.
     */
    QString token(const QString &path) { 
        return row(path).value("token").toString(); 
    }

    /**
     * Extracts the current synchronization state string ('current', 'unreviewed', 'document-changed', etc.).
     */
    QString state(const QString &path) { 
        return row(path).value("state").toString(); 
    }

    /**
     * Links a document path to the active project manifest under a designated role ('notes' or 'reference').
     */
    void link(const QString &path, const QString &role = "notes") {
        const auto result = sync->linkDocument(QUrl::fromLocalFile(path), role);
        QVERIFY2(result.value("ok").toBool(), qPrintable(result.value("error").toString()));
    }

    /**
     * Dispatches alignment confirmation for a linked document using its active state token.
     */
    void confirm(const QString &path) {
        const auto result = sync->confirmAlignment(path, token(path));
        QVERIFY2(result.value("ok").toBool(), qPrintable(result.value("error").toString()));
    }

    /**
     * Updates DocumentSync tracked project board state from raw JSON byte buffer.
     */
    void track(const QByteArray &raw) { 
        sync->track(QUrl::fromLocalFile(project), QString::fromUtf8(raw), QString::fromUtf8(raw)); 
    }

    /**
     * Mutates the text label of the primary shape in a JSON board document, altering semantic content.
     * 
     * @param raw Original JSON byte array.
     * @param label New label string to inject.
     * @return Updated JSON byte array.
     */
    QByteArray editLabel(const QByteArray &raw, const QString &label) {
        auto board = QJsonDocument::fromJson(raw).object();
        auto views = board["views"].toArray();
        auto view = views[0].toObject();
        auto shapes = view["shapes"].toArray();
        auto shape = shapes[0].toObject();
        shape["text"] = label;
        shapes[0] = shape; 
        view["shapes"] = shapes; 
        views[0] = view; 
        board["views"] = views;
        return QJsonDocument(board).toJson();
    }

private slots:
    /**
     * Per-test fixture setup slot: provisions fresh temporary sandboxes and default fixtures.
     */
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

    /**
     * Validates document review state transitions through document modification, board changes, and review confirmations.
     */
    void statesAndPerDocumentReview() {
        link(notes); 
        link(reference, "reference");
        QCOMPARE(state(notes), "unreviewed");
        confirm(notes);
        QCOMPARE(state(notes), "current");
        QCOMPARE(state(reference), "unreviewed");
        
        // Mutate document content on disk; verify status shifts to 'document-changed'
        put(notes, "# Notes\n\nRevised document.\n");
        sync->refresh();
        QCOMPARE(state(notes), "document-changed");
        
        // Mutate board structure; verify composite state shifts to 'both-changed'
        const auto revised = editLabel(original, "Inspect source");
        put(project, revised); 
        track(revised);
        QCOMPARE(state(notes), "both-changed");
        
        // Confirm alignment; state must return to 'current'
        confirm(notes);
        QCOMPARE(state(notes), "current");
        
        // Re-instantiate sync engine simulating application reload; state cache must persist accurately
        sync = std::make_unique<DocumentSync>();
        track(revised);
        QCOMPARE(state(notes), "current");
        QCOMPARE(state(reference), "unreviewed");
    }

    /**
     * Validates draft change tracking, unsaved dirty states, and draft rollback semantics.
     */
    void draftsAndUndo() {
        link(notes); 
        confirm(notes);
        
        // Inject unsaved in-memory draft edit
        sync->updateDraft(QString::fromUtf8(editLabel(original, "Unsaved change")));
        QCOMPARE(state(notes), "board-changed");
        QVERIFY(sync->report().value("unsaved").toBool());
        
        // Invariant: Unsaved drafts cannot be confirmed until committed to disk
        QVERIFY(!sync->confirmAlignment(notes, token(notes)).value("ok").toBool());
        
        // Roll back draft to match clean disk state
        sync->updateDraft(QString::fromUtf8(original));
        QCOMPARE(state(notes), "current");
        QVERIFY(!sync->report().value("unsaved").toBool());
    }

    /**
     * Verifies semantic hashing invariant: visual/layout changes (color, coords, zoom)
     * are filtered out and do not invalidate document alignment.
     */
    void ignoresLayoutButNotStructure() {
        auto data = QJsonDocument::fromJson(original).object();
        data["backgroundColor"] = "#000000";
        data["activeView"] = "other";
        auto views = data["views"].toArray();
        auto view = views[0].toObject();
        view["viewport"] = QJsonObject{{"x", 999}, {"zoom", 3}};
        auto shapes = view["shapes"].toArray();
        auto shape = shapes[0].toObject();
        shape["px"] = 999; 
        shape["shapeColor"] = "#ff0000"; 
        shape["pw"] = 999;
        shapes[0] = shape; 
        view["shapes"] = shapes;
        auto arrows = view["arrows"].toArray();
        auto edge = arrows[0].toObject();
        edge["points"] = QJsonArray{QJsonObject{{"x", 2}, {"y", 3}}}; 
        edge["labelX"] = 88;
        arrows[0] = edge; 
        view["arrows"] = arrows; 
        views[0] = view; 
        data["views"] = views;
        
        // Semantic board hash must match original despite layout mutations
        QCOMPARE(DocumentSync::semanticBoard(QJsonDocument(data).toJson()), DocumentSync::semanticBoard(original));
        
        // Mutating semantic arrow transition label MUST change the semantic hash
        edge["label"] = "different condition"; 
        arrows[0] = edge; 
        view["arrows"] = arrows; 
        views[0] = view; 
        data["views"] = views;
        QVERIFY(DocumentSync::semanticBoard(QJsonDocument(data).toJson()) != DocumentSync::semanticBoard(original));
    }

    /**
     * Tests concurrency safety: rejects stale review tokens when disk contents change concurrently.
     */
    void rejectsStaleReviewsAndExternalBoardEdits() {
        link(notes); 
        confirm(notes);
        const auto stale = token(notes);
        put(notes, "Changed after review opened");
        
        // Reject stale token confirmation attempt
        QVERIFY(!sync->confirmAlignment(notes, stale).value("ok").toBool());
        QCOMPARE(state(notes), "document-changed");
        
        // External file mutation on board JSON
        const auto revised = editLabel(original, "External board edit");
        put(project, revised);
        sync->refresh();
        QVERIFY(!sync->report().value("error").toString().isEmpty());
        QVERIFY(!sync->confirmAlignment(notes, token(notes)).value("ok").toBool());
        track(revised);
        QCOMPARE(state(notes), "both-changed");
    }

    /**
     * Exercises filesystem watcher resilience against atomic file replacement, deletion, and recreation.
     */
    void filesystemWatchSurvivesReplacementAndDeletion() {
        link(notes); 
        confirm(notes);
        put(notes, "Atomic replacement");
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "document-changed", 2500);
        confirm(notes);
        
        // Delete document file
        QVERIFY(QFile::remove(notes));
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "unavailable", 2500);
        
        // Recreate file
        put(notes, "Recreated document");
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "document-changed", 2500);
        confirm(notes);
        put(notes, "Another replacement");
        QTRY_COMPARE_WITH_TIMEOUT(state(notes), "document-changed", 2500);
    }

    /**
     * Validates automated reference documentation generation, diff previewing, and transactional backup creation.
     */
    void referencePreviewAndBackup() {
        link(reference, "reference");
        const auto prior = get(reference);
        auto preview = sync->previewReference(reference);
        QVERIFY(preview.value("ok").toBool());
        QCOMPARE(get(reference), prior);
        QVERIFY(preview.value("proposed").toString().contains("### READ-01: Read source"));
        QVERIFY(preview.value("proposed").toString().contains("ON done -> READ-02"));
        QVERIFY(preview.value("proposed").toString().contains("read_source()"));
        
        // Invalidate preview token via external disk edit
        put(reference, "Manual edit after preview");
        QVERIFY(!sync->writeReference(reference, preview.value("token").toString()).value("ok").toBool());
        QCOMPARE(get(reference), QByteArray("Manual edit after preview"));
        
        // Acquire fresh token and perform atomic write with automatic .sync.bak generation
        preview = sync->previewReference(reference);
        QVERIFY(sync->writeReference(reference, preview.value("token").toString()).value("ok").toBool());
        QCOMPARE(get(reference + ".sync.bak"), QByteArray("Manual edit after preview"));
        QCOMPARE(get(reference), preview.value("proposed").toString().toUtf8());
        QCOMPARE(state(reference), "current");
        
        // Invariant: Non-reference documents cannot be overwritten with reference templates
        link(notes);
        QVERIFY(!sync->previewReference(notes).value("ok").toBool());
    }

    /**
     * Verifies clean unlinking semantics and isolation between distinct project manifests.
     */
    void unlinkAndProjectIsolation() {
        link(notes); 
        confirm(notes);
        const auto contents = get(notes);
        QVERIFY(sync->unlinkDocument(notes, token(notes)).value("ok").toBool());
        QCOMPARE(get(notes), contents);
        QVERIFY(sync->report().value("files").toList().isEmpty());
        
        // Cross-project isolation test
        link(notes); 
        confirm(notes);
        const auto second = dir->filePath("second.json");
        put(second, original);
        sync->track(QUrl::fromLocalFile(second), QString::fromUtf8(original), QString::fromUtf8(original));
        QVERIFY(sync->report().value("files").toList().isEmpty());
        track(original);
        QCOMPARE(state(notes), "current");
    }

    /**
     * Exercises bounds checking, malformed manifest recovery, and payload sizing limits.
     */
    void invalidManifestsAndLimits() {
        link(notes);
        put(project + ".sync.json", "{broken");
        sync->refresh();
        QVERIFY(!sync->report().value("error").toString().isEmpty());
        QVERIFY(!sync->linkDocument(QUrl::fromLocalFile(reference), "reference").value("ok").toBool());
        QCOMPARE(get(project + ".sync.json"), QByteArray("{broken"));
        QVERIFY(QFile::remove(project + ".sync.json"));
        sync->refresh();
        
        // Enforce 4 MiB document size boundary limit
        put(notes, QByteArray(4 * 1024 * 1024 + 1, 'x'));
        QVERIFY(!sync->linkDocument(QUrl::fromLocalFile(notes)).value("ok").toBool());
        
        // Reject non-local remote URLs and self-referential links
        QVERIFY(!sync->linkDocument(QUrl("https://example.com/notes.md")).value("ok").toBool());
        QVERIFY(!sync->linkDocument(QUrl::fromLocalFile(project)).value("ok").toBool());
    }

    /**
     * Validates headless command-line execution without requiring an active graphical display server.
     */
    void commandLineNeedsNoDisplay() {
        link(notes);
        QProcess process;
        auto environment = QProcessEnvironment::systemEnvironment();
        environment.insert("QT_QPA_PLATFORM", "not-a-real-display-plugin");
        process.setProcessEnvironment(environment);
        
        // Exit code 2 indicates documents requiring attention/review
        process.start("/home/user/archi/build/archi", {"--sync-status", project});
        QVERIFY(process.waitForFinished(5000));
        QCOMPARE(process.exitCode(), 2);
        auto result = QJsonDocument::fromJson(process.readAllStandardOutput()).object();
        QCOMPARE(result.value("attention").toInt(), 1);
        
        // Exit code 0 indicates clean synchronization alignment
        confirm(notes);
        process.start("/home/user/archi/build/archi", {"--sync-status", project});
        QVERIFY(process.waitForFinished(5000));
        QCOMPARE(process.exitCode(), 0);
        
        // Exit code 1 indicates manifest parsing error
        put(project + ".sync.json", "not json");
        process.start("/home/user/archi/build/archi", {"--sync-status", project});
        QVERIFY(process.waitForFinished(5000));
        QCOMPARE(process.exitCode(), 1);
    }
};

// Headless test runner entry point without GUI event loop dependencies
QTEST_GUILESS_MAIN(SyncTests)
#include "test_sync.moc"
