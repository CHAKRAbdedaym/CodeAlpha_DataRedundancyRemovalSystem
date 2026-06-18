import React, { useState } from 'react';
import CSVUpload from '../components/CSVUpload';
import { ShieldCheck, Info } from 'lucide-react';

const UploadPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4 text-balanced">Upload New Dataset</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our intelligent system will automatically detect duplicates, validate email formats, and ensure only unique records are preserved.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 font-bold">1</div>
          <h4 className="font-bold text-gray-900 mb-2">Internal Scan</h4>
          <p className="text-xs text-gray-500">Detects duplicates within the same file based on email.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 font-bold">2</div>
          <h4 className="font-bold text-gray-900 mb-2">Cross-Reference</h4>
          <p className="text-xs text-gray-500">Verifies data against existing records in our ecosystem.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 font-bold">3</div>
          <h4 className="font-bold text-gray-900 mb-2">Secure Storage</h4>
          <p className="text-xs text-gray-500">Only strictly unique, validated records are committed.</p>
        </div>
      </div>

      <CSVUpload />

      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
        <Info className="text-amber-600 shrink-0" size={24} />
        <div>
          <p className="text-sm font-bold text-amber-800 mb-1">Required CSV Structure</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            Ensure your file includes exactly these columns: <span className="font-mono bg-white px-1 rounded">name</span>, 
            <span className="font-mono bg-white px-1 rounded">email</span>, and 
            <span className="font-mono bg-white px-1 rounded">phone</span>. 
            The system uses the <span className="font-bold italic">email</span> field as the primary unique identifier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
