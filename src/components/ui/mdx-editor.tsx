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
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MDXEditorComponent = React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  ({ value, onChange, placeholder, className, disabled }, ref) => {
    const editorRef = useRef<MDXEditorMethods | null>(null);

    // Keep local state to avoid re-rendering parent on each keystroke
    const [localMarkdown, setLocalMarkdown] = useState<string>(value);

    // Sync local state when external value changes (e.g., form resets)
    useEffect(() => {
      if (value !== localMarkdown) {
        setLocalMarkdown(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Debounce propagating changes up to the parent to reduce expensive form rerenders
    useEffect(() => {
      const handle = setTimeout(() => {
        if (localMarkdown !== value) {
          onChange(localMarkdown);
        }
      }, 250);
      return () => clearTimeout(handle);
      // Intentionally omit onChange from deps to keep stable behavior
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localMarkdown, value]);

    const setEditorRef = useCallback(
      (instance: MDXEditorMethods | null) => {
        editorRef.current = instance;
        if (typeof ref === "function") {
          ref(instance as unknown as MDXEditorMethods);
        } else if (ref) {
          (ref as React.MutableRefObject<MDXEditorMethods | null>).current =
            instance;
        }
      },
      [ref]
    );

    const ToolbarContents = useCallback(
      () => (
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
      [disabled]
    );

    const plugins = useMemo(
      () => [
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
          toolbarContents: ToolbarContents,
        }),
      ],
      [ToolbarContents]
    );

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
          ref={setEditorRef}
          markdown={localMarkdown}
          onChange={setLocalMarkdown}
          placeholder={placeholder}
          readOnly={disabled}
          plugins={plugins}
        />
      </div>
    );
  }
);

MDXEditorComponent.displayName = "MDXEditor";

export { MDXEditorComponent as MDXEditor };
