import {
    Dialogs,
    CancelFunction,
    CommitFunction,
    ObjectData,
} from "@jsplumbtoolkit/browser-ui"

export type DialogManager = {
    showEdgeLabelDialog: (data: ObjectData, callback: Function, abort: CancelFunction) => any,
    confirmDelete:(data:ObjectData, callback:CommitFunction) => any,
    editName:(data:ObjectData, callback:CommitFunction) => any
    showTextDialog:(title:string, data:ObjectData, callback:CommitFunction, abort?:CancelFunction) => any
    showConfirmDialog:(prompt:string, callback:CommitFunction) => any
}

export default function createDialogManager():DialogManager {
    const dialogs = new Dialogs({
        dialogs: {
            dlgText: {
                template:'<input type="text" size="50" jtk-focus jtk-att="text" value="{{text}}" jtk-commit="true"/>',
                title:'Enter Text',
                cancelable:true
            },
            dlgConfirm: {
                template:'{{msg}}',
                title:'Please Confirm',
                cancelable:true
            },
            dlgMessage: {
                template:'{{msg}}',
                title:'Message',
                cancelable:false
            }
        }
    })

    const dialogManager:DialogManager = {
        showEdgeLabelDialog: (data: ObjectData, callback: Function, abort: CancelFunction) => {
            dialogs.show({
                id: 'dlgText',
                data: {
                    text: data.label || ''
                },
                onOK: (d: any) => {
                    callback({label: d.text || ''})
                },
                onCancel: abort
            })
        },
        confirmDelete:(data:ObjectData, callback:CommitFunction) => {
            dialogs.show({
                id: "dlgConfirm",
                data: {
                    msg: `Delete '${data.text}'?`
                },
                onOK: callback
            });
        },
        editName:(data:ObjectData, callback:CommitFunction) => {
            dialogs.show({
                id: "dlgText",
                data: data,
                title: "Edit " + data.type + " name",
                onOK:  callback
            });
        },
        showTextDialog:(title:string, data:ObjectData, callback:CommitFunction, abort?:CancelFunction) => {
            dialogs.show({
                id:"dlgText",
                title,
                data:data || {},
                onOK:callback
            })
        },
        showConfirmDialog:(prompt:string, callback:CommitFunction) => {
            dialogs.show({
                id:"dlgConfirm",
                data:{msg:prompt},
                onOK:callback
            })
        }
    }

    return dialogManager
}

