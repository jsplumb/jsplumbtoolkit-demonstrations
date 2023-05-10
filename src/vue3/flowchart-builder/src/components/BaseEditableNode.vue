<script>

   import { BaseNodeComponent } from '@jsplumbtoolkit/browser-ui-vue3'
   import { consume } from "@jsplumbtoolkit/browser-ui"

    export default {
        mixins:[ BaseNodeComponent ],
        inject:['service'],
        methods:{
            edit:function(event) {
                consume(event);
                this.service.editNode(this.getNode(), (data) => {
                    if (data.text && data.text.length > 2) {
                        // if name is at least 2 chars long, update the underlying data and
                        // update the UI.
                        this.updateNode(data);
                    }
                })
            },
            maybeDelete:function(event) {
                consume(event);
                const node = this.getNode()
                this.service.maybeDelete(node, this.toolkit)
            }
        }
    }

</script>
