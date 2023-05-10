
export default function createNodeOps(dialogManager) {
    return {
        remove:(node, toolkit) => {
            if (node) {
                dialogManager.confirmDelete(node.data, () => toolkit.removeNode(node))
            }
        },

        edit(node, toolkit) {
            if (node) {
                dialogManager.editName(node.data, (data) => {
                    if (data.text && data.text.length > 2) {
                        // if name is at least 2 chars long, update the underlying data and
                        // update the UI.
                        toolkit.updateNode(node, data);
                    }
                })
            }
        }
    }
}

