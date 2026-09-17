import QtQuick
import QtTest
import ".." as Board
import "../../../archi/qml/WorkflowChecks.js" as WorkflowChecks

Item {
    width: 1360
    height: 880
    Board.ArchiBoard { id: board; autoSave: false; rememberProjects: false }

    TestCase {
        name: "ArchiBoard"
        when: windowShown
        property string original: ""
        property var canvas: board.boardCanvas

        function initTestCase() {
            tryVerify(() => board.document !== null)
            const fixture = JSON.parse(board.readFile(board.documentUrl))
            fixture.activeView = fixture.views[0].id
            original = JSON.stringify(fixture)
        }
        function init() {
            board.autoSave = false
            board.documentUrl = "file:///tmp/ea-board-test.json"
            board.writeFile(board.documentUrl, original)
            board.writeFile(String(board.documentUrl) + ".sync.json", JSON.stringify({format: "archi-document-sync", version: 1, documents: []}))
            verify(board.loadDocument())
            board.width = 1360
            board.height = 880
            board.requestActivate()
            canvas.forceActiveFocus()
            wait(80)
        }
        function cleanup() { findChild(board, "syncPanel").close(); board.dirty = false }

        function test_sync_panel_tracks_unsaved_and_external_changes() {
            const notesUrl = "file:///tmp/archi-ui-sync.md"
            const notesPath = "/tmp/archi-ui-sync.md"
            board.writeFile(notesUrl, "# Test notes\n")
            verify(projectSync.linkDocument(notesUrl, "notes").ok)
            const panel = findChild(board, "syncPanel")
            panel.open()
            panel.selectedPath = notesPath
            wait(200)
            compare(panel.selectedRow.state, "unreviewed")
            const acknowledgement = findChild(panel, "syncAcknowledgement")
            acknowledgement.checked = true
            mouseClick(findChild(panel, "confirmAlignment"))
            compare(panel.selectedRow.state, "current")
            panel.close()
            canvas.shapesModel.setProperty(0, "text", "Changed inside Archi")
            tryVerify(() => projectSync.report.files[0].state === "board-changed")
            verify(projectSync.report.unsaved)
            board.writeFile(notesUrl, "# Notes changed externally\n")
            tryVerify(() => projectSync.report.files[0].state === "both-changed", 2500)
            panel.open()
            wait(200)
            verify(!acknowledgement.enabled)
            verify(board.saveDocument())
            board.refreshSyncDraft()
            tryVerify(() => acknowledgement.enabled)
            verify(boardTestTools.captureWindow(board, "/tmp/archi-sync-desktop.png"))
            board.width = 466
            board.height = 506
            wait(200)
            verify(panel.width <= board.width)
            verify(boardTestTools.captureWindow(board, "/tmp/archi-sync-small.png"))
            panel.close()
        }

        function test_sync_includes_unapplied_inspector_edits() {
            const url = "file:///tmp/archi-inspector-sync.md"
            board.writeFile(url, "# Notes\n")
            verify(projectSync.linkDocument(url, "notes").ok)
            let row = projectSync.report.files[0]
            verify(projectSync.confirmAlignment(row.path, row.token).ok)
            canvas.selectShape(1)
            const notes = findChild(board, "nodeNotes")
            notes.text = "An unapplied analysis change"
            tryVerify(() => projectSync.report.files[0].state === "board-changed")
            verify(board.syncDraftPending)
            verify(projectSync.report.unsaved)
            verify(board.saveDocument())
            board.refreshSyncDraft()
            verify(!projectSync.report.unsaved)
            compare(projectSync.report.files[0].state, "board-changed")
        }

        function test_sync_reference_preview_and_stale_acknowledgement() {
            const url = "file:///tmp/archi-preview-sync.md"
            const path = "/tmp/archi-preview-sync.md"
            board.writeFile(url, "# Manual reference\n")
            verify(projectSync.linkDocument(url, "reference").ok)
            const panel = findChild(board, "syncPanel")
            panel.open()
            panel.selectedPath = path
            wait(200)
            const acknowledgement = findChild(panel, "syncAcknowledgement")
            acknowledgement.checked = true
            board.writeFile(url, "# Changed after acknowledgement\n")
            mouseClick(findChild(panel, "confirmAlignment"))
            compare(panel.selectedRow.state, "unreviewed")
            verify(panel.actionError.includes("changed"))
            panel.openPreview()
            const preview = findChild(panel, "referencePreview")
            tryCompare(preview, "opened", true)
            verify(boardTestTools.captureWindow(board, "/tmp/archi-sync-preview.png"))
            board.width = 466
            board.height = 506
            wait(200)
            verify(boardTestTools.captureWindow(board, "/tmp/archi-sync-preview-small.png"))
            preview.close()
            panel.close()
        }

        function capture(item, path) {
            let saved = false
            verify(item.grabToImage(result => { saved = result.saveToFile(path) }))
            tryVerify(() => saved)
        }

        function test_delete_and_undo() {
            const count = canvas.shapesModel.count
            const connections = canvas.arrows.length
            const id = canvas.shapesModel.get(0).shapeId
            canvas.focusShape(id)
            mouseClick(canvas, canvas.width / 2, canvas.height / 2)
            compare(canvas.selectedId, id)
            keyClick(Qt.Key_Delete)
            compare(canvas.shapesModel.count, count - 1)
            verify(canvas.arrows.every(a => a.fromId !== id && a.toId !== id))
            keyClick(Qt.Key_Z, Qt.ControlModifier)
            compare(canvas.shapesModel.count, count)
            compare(canvas.arrows.length, connections)
            keyClick(Qt.Key_Z, Qt.ControlModifier | Qt.ShiftModifier)
            compare(canvas.shapesModel.count, count - 1)
            canvas.undo()
        }

        function test_middle_button_cannot_paste() {
            canvas.focusShape(1)
            const text = canvas.shapesModel.get(0).text
            mouseDoubleClickSequence(canvas, canvas.width / 2, canvas.height / 2)
            compare(canvas.editingIndex, 0)
            const before = canvas.viewX
            mouseDrag(canvas, canvas.width / 2, canvas.height / 2, 45, 15, Qt.MiddleButton)
            compare(canvas.shapesModel.get(0).text, text)
            verify(canvas.viewX < before)
            compare(canvas.editingIndex, -1)
        }

        function test_context_menu_while_editing() {
            canvas.focusShape(1)
            mouseDoubleClickSequence(canvas, canvas.width / 2, canvas.height / 2)
            mouseClick(canvas, canvas.width / 2, canvas.height / 2, Qt.RightButton)
            compare(canvas.editingIndex, -1)
            const node = findChild(canvas, "shape-1")
            const menu = node.nodeMenu
            tryCompare(menu, "opened", true)
            verify(boardTestTools.captureWindow(board, "/tmp/archi-context-menu.png"))
            const count = canvas.shapesModel.count
            mouseClick(menu.itemAt(4))
            compare(canvas.shapesModel.count, count - 1)
            canvas.undo()
            compare(canvas.shapesModel.count, count)
        }

        function test_project_switch_and_color_roundtrip() {
            const originalUrl = String(board.documentUrl)
            board.bgColor = "#caffee"
            canvas.shapesModel.setProperty(0, "text", "Project A retained")
            const second = "file:///tmp/archi-project-" + Date.now() + ".json"
            verify(board.createProject(second, "Independent project"))
            compare(board.document.title, "Independent project")
            compare(canvas.shapesModel.count, 0)
            board.bgColor = "#e8ecff"
            canvas.createShape(200, 150)
            canvas.editingIndex = -1
            board.addView("Pipeline")
            compare(board.document.views.length, 2)
            verify(board.openProject(originalUrl))
            compare(String(board.bgColor), "#caffee")
            compare(canvas.shapesModel.get(0).text, "Project A retained")
            verify(board.openProject(second))
            compare(String(board.bgColor), "#e8ecff")
            compare(board.document.views.length, 2)
            board.switchView(0)
            compare(canvas.shapesModel.count, 1)
            verify(board.savedBackgrounds.indexOf("#caffee") >= 0)
            const retained = board.readFile(originalUrl)
            verify(!board.createProject(originalUrl, "Must not overwrite"))
            compare(board.readFile(originalUrl), retained)
        }

        function test_math_and_workflow_tools() {
            const mathDialog = findChild(board, "mathDialog")
            mathDialog.open()
            wait(250)
            const expression = findChild(board, "mathExpression")
            expression.text = "(x + 1)**3"
            findChild(board, "mathOperation").currentIndex = 1
            mouseClick(findChild(board, "calculateMath"))
            tryCompare(mathEngine, "busy", false, 7000)
            compare(mathEngine.error, "")
            compare(mathEngine.result, "x**3 + 3*x**2 + 3*x + 1")
            const count = canvas.shapesModel.count
            capture(mathDialog.contentItem, "/tmp/archi-math.png")
            verify(boardTestTools.captureWindow(board, "/tmp/archi-math-window.png"))
            expression.text = "x + 9"
            verify(!findChild(board, "insertMath").enabled)
            expression.text = "(x + 1)**3"
            verify(findChild(board, "insertMath").enabled)
            mouseClick(findChild(board, "insertMath"))
            compare(canvas.shapesModel.count, count + 1)
            verify(board.checkWorkflow().includes("Unreachable"))
            const added = canvas.shapesModel.get(count)
            compare(added.pseudocode, "(x + 1)**3\n=> x**3 + 3*x**2 + 3*x + 1")
        }

        function test_context_menu_edit_text() {
            canvas.focusShape(1)
            mouseClick(canvas, canvas.width / 2, canvas.height / 2, Qt.RightButton)
            const menu = findChild(canvas, "shape-1").nodeMenu
            tryCompare(menu, "opened", true)
            mouseClick(menu.itemAt(0))
            compare(canvas.editingIndex, 0)
            wait(100)
            for (const c of "Edited via menu") keyClick(c)
            keyClick(Qt.Key_Escape)
            compare(canvas.shapesModel.get(0).text, "Edited via menu")
            canvas.undo()
            compare(canvas.shapesModel.get(0).text, "Receive an event")
        }

        function test_workflow_checks() {
            const view = {shapes: [{shapeId: 1, text: "Question", shapeKind: "decision"},
                                   {shapeId: 2, text: "Done", shapeKind: "terminal"}],
                          arrows: [{fromId: 1, toId: 1, label: "Again"}]}
            const report = WorkflowChecks.analyze(view)
            verify(report.includes("Unreachable"))
            verify(report.includes("Cycle present"))
            verify(report.includes("Decision needs branches"))
            view.arrows.push({fromId: 1, toId: 2, label: "Again"})
            verify(WorkflowChecks.analyze(view).includes("Duplicate branch labels"))
            view.arrows[1].label = ""
            verify(WorkflowChecks.analyze(view).includes("Unlabeled decision branch"))
            view.arrows[1].label = "Done"
            view.arrows.shift()
            view.shapes[0].shapeKind = "process"
            verify(WorkflowChecks.analyze(view).includes("No structural issues found"))
            view.arrows.push({fromId: 2, toId: 99})
            verify(WorkflowChecks.analyze(view).includes("missing endpoint"))
        }

        function test_new_view_preserves_undo() {
            canvas.selectShape(1)
            canvas.duplicateSelection()
            const duplicate = canvas.selectedId
            board.addView("New pipeline")
            board.switchView(0)
            verify(canvas.canUndo)
            canvas.undo()
            verify(!canvas.findShapeById(duplicate))
        }

        function test_text_delete_is_not_shape_delete() {
            canvas.focusShape(1)
            const count = canvas.shapesModel.count
            mouseDoubleClickSequence(canvas, canvas.width / 2, canvas.height / 2)
            compare(canvas.editingIndex, 0)
            keyClick(Qt.Key_A, Qt.ControlModifier)
            keyClick(Qt.Key_Delete)
            compare(canvas.shapesModel.count, count)
            compare(canvas.shapesModel.get(0).text, "")
            for (const c of "One operation") keyClick(c)
            keyClick(Qt.Key_Escape)
            compare(canvas.editingIndex, -1)
            compare(canvas.shapesModel.get(0).text, "One operation")
            canvas.undo()
            compare(canvas.shapesModel.get(0).text, "Receive an event")
        }

        function test_roundtrip_metadata_and_conflict() {
            const key = canvas.shapesModel.get(0).nodeKey
            const code = canvas.shapesModel.get(0).pseudocode
            const edge = JSON.stringify(canvas.arrows[2])
            canvas.shapesModel.setProperty(0, "text", "Changed label")
            board.switchView(6)
            verify(board.saveDocument())
            verify(board.loadDocument())
            board.switchView(0)
            compare(canvas.shapesModel.get(0).text, "Changed label")
            compare(canvas.shapesModel.get(0).nodeKey, key)
            compare(canvas.shapesModel.get(0).pseudocode, code)
            compare(JSON.stringify(canvas.arrows[2]), edge)
            const external = JSON.parse(board.readFile(board.documentUrl))
            external.title = "External edit"
            board.writeFile(board.documentUrl, JSON.stringify(external))
            canvas.shapesModel.setProperty(0, "text", "Local recovery")
            verify(!board.saveDocument())
            compare(JSON.parse(board.readFile(board.documentUrl)).title, "External edit")
            compare(JSON.parse(board.readFile(String(board.documentUrl) + ".recovery.json")).views[0].shapes[0].text, "Local recovery")
        }

        function test_autosave_backup() {
            board.autoSave = true
            canvas.shapesModel.setProperty(0, "text", "Autosaved operation")
            verify(board.dirty)
            tryCompare(board, "dirty", false, 3000)
            compare(JSON.parse(board.readFile(board.documentUrl)).views[0].shapes[0].text, "Autosaved operation")
            compare(JSON.parse(board.readFile(String(board.documentUrl) + ".bak")).views[0].shapes[0].text, "Receive an event")
        }

        function test_duplicate_and_arrow_removal() {
            canvas.selectShape(1)
            canvas.duplicateSelection()
            const id = canvas.selectedId
            verify(id !== 1)
            compare(canvas.findShapeById(id).nodeKey, "")
            canvas.undo()
            verify(!canvas.findShapeById(id))
            const count = canvas.arrows.length
            canvas.selectShape(-1)
            canvas.selectedArrow = 0
            verify(canvas.deleteSelection())
            compare(canvas.arrows.length, count - 1)
            canvas.undo()
            compare(canvas.arrows.length, count)
        }

        function test_inspector_edit_and_view_history() {
            canvas.selectShape(1)
            const drawer = findChild(board, "nodeInspector")
            drawer.open()
            wait(250)
            const notes = findChild(board, "nodeNotes")
            verify(notes.width > 100)
            notes.text = "A revised, editable analysis note."
            board.applyDetails()
            compare(canvas.shapesModel.get(0).description, notes.text)
            board.switchView(1)
            board.switchView(0)
            verify(canvas.canUndo)
            canvas.undo()
            verify(canvas.shapesModel.get(0).description !== "A revised, editable analysis note.")
            canvas.selectShape(1)
            wait(100)
            capture(findChild(board, "detailsScroll"), "/tmp/ea-expanded-details.png")
            drawer.close()
        }

        function test_render_all_views() {
            verify(boardTestTools.captureWindow(board, "/tmp/archi-desktop.png"))
            for (let i = 0; i < board.document.views.length; ++i) {
                board.switchView(i)
                board.fitView()
                wait(60)
                const image = grabImage(canvas)
                verify(image.width > 0 && image.height > 0)
                capture(canvas, "/tmp/ea-expanded-" + board.document.views[i].id + ".png")
            }
        }

        function test_small_window_and_long_text() {
            board.width = 466
            board.height = 506
            wait(100)
            canvas.shapesModel.setProperty(0, "text", "Long content ".repeat(90))
            canvas.focusShape(1)
            wait(100)
            const label = findChild(canvas, "shapeLabel-1")
            verify(label !== null)
            verify(label.clip)
            verify(label.width <= canvas.findShapeById(1).pw)
            verify(board.menuBar.width <= board.width)
            capture(canvas, "/tmp/ea-expanded-small.png")
            capture(board.menuBar, "/tmp/ea-expanded-navigation.png")
            capture(board.header, "/tmp/ea-expanded-toolbar.png")
            verify(boardTestTools.captureWindow(board, "/tmp/archi-small-window.png"))
        }
    }
}
