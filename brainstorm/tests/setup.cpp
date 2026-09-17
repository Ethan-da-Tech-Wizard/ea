#include "../DocumentFiles.h"
#include "../../../archi/src/MathEngine.h"
#include "../../../archi/src/DocumentSync.h"
#include <QQmlContext>
#include <QQmlEngine>
#include <QQuickStyle>
#include <QQuickWindow>
#include <QtQuickTest/quicktest.h>
#include <memory>

class BoardSetup : public QObject {
    Q_OBJECT
    DocumentFiles files;
    MathEngine math;
    std::unique_ptr<DocumentSync> sync;
public:
    Q_INVOKABLE bool captureWindow(QQuickWindow *window, const QString &path) {
        return window && window->grabWindow().save(path);
    }
public slots:
    void applicationAvailable() { QQuickStyle::setStyle("Fusion"); }
    void qmlEngineAvailable(QQmlEngine *engine) {
        sync = std::make_unique<DocumentSync>();
        engine->rootContext()->setContextProperty("boardFiles", &files);
        engine->rootContext()->setContextProperty("mathEngine", &math);
        engine->rootContext()->setContextProperty("projectSync", sync.get());
        engine->rootContext()->setContextProperty("boardTestTools", this);
    }
};

QUICK_TEST_MAIN_WITH_SETUP(board, BoardSetup)
#include "setup.moc"
