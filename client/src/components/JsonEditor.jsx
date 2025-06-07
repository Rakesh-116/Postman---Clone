import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

export default function JsonEditor({ value, onChange, readOnly = false }) {
  const handleChange = React.useCallback(
    (val) => {
      if (!readOnly) {
        onChange(val);
      }
    },
    [onChange, readOnly]
  );

  return (
    <div className="border rounded overflow-hidden">
      <CodeMirror
        value={value}
        height="200px"
        extensions={[json()]}
        onChange={handleChange}
        readOnly={readOnly}
        theme="dark"
        className="text-sm font-mono"
      />
    </div>
  );
}
