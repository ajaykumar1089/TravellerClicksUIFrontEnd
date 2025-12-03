"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// 👉 FIX: Dynamically import CKEditor + ClassicEditor with proper types
// const CKEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor),
//   { ssr: false }
// );

// const ClassicEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-build-classic"),
//   { ssr: false }
// );

export default function HolidayPackagePage() {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [editorData, setEditorData] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const handleSubmit = () => {
    console.log("FORM DATA:", {
      title,
      shortDesc,
      editorData,
      price,
      duration,
      images,
    });
    alert("Holiday Package Saved!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Create Holiday Package</h1>

      {/* Title */}
      <label className="font-medium">Package Title</label>
      <input
        type="text"
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter package title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Short Description */}
      <label className="font-medium">Short Description</label>
      <textarea
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter short description"
        rows={3}
        value={shortDesc}
        onChange={(e) => setShortDesc(e.target.value)}
      ></textarea>

      {/* Price */}
      <label className="font-medium">Price</label>
      <input
        type="number"
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* Duration */}
      <label className="font-medium">Duration (e.g., 5 Days / 4 Nights)</label>
      <input
        type="text"
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      {/* CKEditor */}
      <label className="font-medium">Detailed Description</label>
      {/* <div className="border rounded mb-4 p-2 bg-white">
        {typeof window !== "undefined" && ClassicEditor && (
          <CKEditor
            editor={ClassicEditor as any}
            data={editorData}
            onChange={(event: any, editor: any) => {
              setEditorData(editor.getData());
            }}
          />
        )}
      </div> */}

      {/* Images */}
      <label className="font-medium">Images</label>
      <input
        type="file"
        multiple
        className="w-full border p-2 rounded mb-4"
        onChange={handleImageUpload}
      />

      {/* Preview Uploaded */}
      {images.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Preview:</h3>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
      >
        Save Package
      </button>
    </div>
  );
}
