'use client'

import React from 'react'
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  type MDXEditorMethods
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { cn } from '@/lib/utils'

interface MDXEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const MDXEditorComponent = React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  ({ value, onChange, placeholder, className, disabled }, ref) => {
    return (
      <div className={cn('border rounded-md', className)}>
        <MDXEditor
          ref={ref}
          markdown={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={disabled}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <Separator />
                  <BlockTypeSelect />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <CreateLink />
                  <InsertImage />
                  <Separator />
                  <InsertTable />
                  <InsertThematicBreak />
                </>
              )
            })
          ]}
        />
      </div>
    )
  }
)

MDXEditorComponent.displayName = 'MDXEditor'

export { MDXEditorComponent as MDXEditor }
