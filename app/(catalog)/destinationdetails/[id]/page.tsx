"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Load CKEditor React component dynamically (client only)
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor), {
  ssr: false,
});

// ClassicEditor is NOT a React component, so import normally
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function DestinationDetailsPage({ params }: any) {
  const [description, setDescription] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Destination Details</h1>

      <div className="bg-white p-4 rounded shadow">
        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </div>

      <pre className="mt-4 p-3 bg-gray-200 rounded">
        {description}
      </pre>
    </div>
  );
}
