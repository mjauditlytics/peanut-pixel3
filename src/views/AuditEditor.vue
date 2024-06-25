<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useStorage } from '@vueuse/core';
// import { Fragment } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Mark, mergeAttributes } from '@tiptap/core';


const Redact = Mark.create({
  name: 'redact',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-redacted]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-redacted': '' }), 0]
  },

  addCommands() {
    return {
      setRedact: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      unsetRedact: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})

const content = useStorage('audit-content', '');
const showRedacted = ref(false);

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit, Redact],
  onUpdate: ({ editor }) => {
    content.value = editor.getHTML();
  },
});


const redactedItems = ref([]);
const redactedSidebarVisible = ref(false);
const searchQuery = ref('');

const filteredRedactedItems = computed(() => {
  return redactedItems.value.filter(item => 
    item.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


const redact = () => {
  const { from, to } = editor.value.state.selection;
  const text = editor.value.state.doc.textBetween(from, to);
  
  if (text) {
    const shouldRedactAll = confirm(`Redact all instances of "${text}"?`);
    if (shouldRedactAll) {
      editor.value.chain().focus().command(({ tr, dispatch }) => {
        const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        tr.doc.descendants((node, pos) => {
          if (node.isText) {
            let match;
            while ((match = regex.exec(node.text)) !== null) {
              const start = pos + match.index;
              const end = start + match[0].length;
              tr = tr.addMark(start, end, editor.value.schema.marks.redact.create());
            }
          }
        });
        if (dispatch) dispatch(tr);
        return true;
      }).run();
    } else {
      editor.value.chain().focus().setMark('redact').run();
    }
    const newItem = { id: Date.now(), text: text, visible: false };
    redactedItems.value.push(newItem);
  }
};


const unredact = () => {
  const { from, to } = editor.value.state.selection;
  const text = editor.value.state.doc.textBetween(from, to);
  
  if (text) {
    const shouldUnredactAll = confirm(`Unredact all instances of "${text}"?`);
    if (shouldUnredactAll) {
      editor.value.chain().focus().command(({ tr, dispatch }) => {
        const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        tr.doc.descendants((node, pos) => {
          if (node.isText) {
            let match;
            while ((match = regex.exec(node.text)) !== null) {
              const start = pos + match.index;
              const end = start + match[0].length;
              tr = tr.removeMark(start, end, editor.value.schema.marks.redact);
            }
          }
        });
        if (dispatch) dispatch(tr);
        return true;
      }).run();
    } else {
      editor.value.chain().focus().unsetMark('redact').run();
    }
    redactedItems.value = redactedItems.value.filter(item => item.text !== text);
  } else {
    // If no text is selected, unredact the entire document
    editor.value.chain().focus().unsetMark('redact').run();
  }
};

const toggleShowRedacted = () => {
  showRedacted.value = !showRedacted.value;
};


const toggleRedactedSidebar = () => {
  redactedSidebarVisible.value = !redactedSidebarVisible.value;
};

const toggleItemVisibility = (item) => {
  // Toggle visibility in the editor
  editor.value.chain().focus().toggleRedact(item.text).run();
};

const removeRedaction = (item) => {
  // Remove redaction in the editor
  editor.value.chain().focus().unredact(item.text).run();
  // Remove from list
  redactedItems.value = redactedItems.value.filter(i => i.id !== item.id);
};

const showAllRedacted = () => {
  redactedItems.value.forEach(item => {
    item.visible = true;
    editor.value.chain().focus().showRedact(item.text).run();
  });
};

const hideAllRedacted = () => {
  redactedItems.value.forEach(item => {
    item.visible = false;
    editor.value.chain().focus().hideRedact(item.text).run();
  });
};

watch(showRedacted, (newValue) => {
  if (editor.value) {
    editor.value.chain().focus().setContent(editor.value.getHTML()).run();
  }
});

onMounted(() => {
  if (editor.value) {
    editor.value.commands.setContent(content.value);
  }
});
</script>

<template>
  <div class="editor-container" :class="{ 'show-redacted': showRedacted }">
    <div class="toolbar">
      <Button @click="redact" icon="pi pi-eye-slash" label="Redact" />
      <Button @click="unredact" icon="pi pi-eye" label="Unredact" />
      <Button @click="toggleShowRedacted" :icon="showRedacted ? 'pi pi-eye-slash' : 'pi pi-eye'" :label="showRedacted ? 'Hide Redacted' : 'Show Redacted'" />

      <Button 
          @click="toggleRedactedSidebar" 
          :icon="redactedSidebarVisible ? 'pi pi-times' : 'pi pi-list'" 
          :label="redactedSidebarVisible ? 'Close Sidebar' : 'Redacted Items'" 
        />
    </div>
    <EditorContent :editor="editor" />

    <Sidebar v-model:visible="redactedSidebarVisible" position="right" class="redacted-sidebar">
      <h3>Redacted Items</h3>
      <div class="p-input-icon-left mb-3">
        <i class="pi pi-search" />
        <InputText v-model="searchQuery" placeholder="Search redacted items" />
      </div>
      <div class="global-controls mb-3">
        <Button @click="showAllRedacted" icon="pi pi-eye" label="Show All" class="p-button-sm mr-2" />
        <Button @click="hideAllRedacted" icon="pi pi-eye-slash" label="Hide All" class="p-button-sm" />
      </div>
      <div class="redacted-items-list">
        <div v-for="item in filteredRedactedItems" :key="item.id" class="redacted-item p-2">
          <div class="redacted-text">{{ item.text }}</div>
          <div class="item-controls">
            <ToggleButton 
              v-model="item.visible" 
              onIcon="pi pi-eye" 
              offIcon="pi pi-eye-slash" 
              @change="toggleItemVisibility(item)"
              class="p-button-sm mr-2"
            />
            <Button 
              @click="removeRedaction(item)" 
              icon="pi pi-times" 
              class="p-button-sm p-button-danger"
            />
          </div>
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<style>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}


.main-content {
  flex-grow: 1;
}
.redacted-sidebar {
  width: 300px;
  padding: 1rem;
}
.redacted-items-list {
  max-height: 500px;
  overflow-y: auto;
}
.redacted-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.toolbar {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.toolbar .p-button {
  margin-right: 8px;
}

[data-redacted] {
  background-color: black;
  color: transparent;
}

.show-redacted [data-redacted] {
  background-color: yellow;
  color: inherit;
}
</style>