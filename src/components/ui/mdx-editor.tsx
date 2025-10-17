"use client";

import React from "react";
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
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MDXEditorComponent = React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  ({ value, onChange, placeholder, className, disabled }, ref) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const editorRef = useRef<MDXEditorMethods | null>(null);

    // SSR fallback - simple textarea
    if (!isClient) {
      return (
        <div className={cn("border rounded-md", className)}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full min-h-[200px] p-3 rounded-md border-0 resize-none focus:outline-none"
          />
        </div>
      );
    }

    function SpacerButton({ disabled }: { disabled?: boolean }) {
      const insertSpacer = () => {
        if (!editorRef.current || disabled) return;
        editorRef.current.insertMarkdown("\n\u00A0\n");
      };
      return (
        <button
          type="button"
          onClick={insertSpacer}
          disabled={disabled}
          title="Insert spacer"
          aria-label="Insert spacer"
          className="mx-1 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          ↵↵
        </button>
      );
    }

    return (
      <div className={cn("border rounded-md", className)}>
        <MDXEditor
          ref={(instance) => {
            editorRef.current = instance as MDXEditorMethods | null;
            if (typeof ref === "function") {
              ref(instance);
            } else if (ref) {
              (ref as React.MutableRefObject<MDXEditorMethods | null>).current =
                instance as MDXEditorMethods | null;
            }
          }}
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
            codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                css: "CSS",
                txt: "text",
                tsx: "TypeScript",
              },
            }),
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
                  <Separator />
                  <SpacerButton disabled={disabled} />
                </>
              ),
            }),
          ]}
        />
      </div>
    );
  }
);

MDXEditorComponent.displayName = "MDXEditor";

export { MDXEditorComponent as MDXEditor };
