import { useCreateBlockNote } from "@blocknote/react";
// Or, you can use ariakit, shadcn, etc.
import { BlockNoteView } from "@blocknote/mantine";
import { ko } from "@blocknote/core/locales";
// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";

export function AppEditor() {
    const locale = ko;
    // Create a new editor instance
    const editor = useCreateBlockNote({
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                emptyDocument: "텍스트를 입력하거나 '/' 를 눌러 명령어를 실행하세요.",
            },
        },
    });

    // Render the editor
    return <BlockNoteView editor={editor} />;
}
