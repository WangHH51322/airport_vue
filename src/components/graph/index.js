import mx from 'mxgraph'

const mxgraph = mx({
    mxBasePath: '/public/mxgraph'
})

// decode bug https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = mxgraph.mxGraph
window.mxGraphModel = mxgraph.mxGraphModel
window.mxEditor = mxgraph.mxEditor
window.mxGeometry = mxgraph.mxGeometry
window.mxDefaultKeyHandler = mxgraph.mxDefaultKeyHandler
window.mxDefaultPopupMenu = mxgraph.mxDefaultPopupMenu
window.mxStylesheet = mxgraph.mxStylesheet
window.mxDefaultToolbar = mxgraph.mxDefaultToolbar
window.mxToolbar = mxgraph.mxToolbar
window.mxUndoManager = mxgraph.mxUndoManager
window.mxImage = mxgraph.mxImage

export default mxgraph