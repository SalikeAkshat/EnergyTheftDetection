import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage('File size should be less than 10MB');
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setUploadStatus('success');
      onFileUpload(file);
    } else {
      setUploadStatus('error');
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadStatus('success');
      onFileUpload(file);
    } else {
      setUploadStatus('error');
    }
  }, [onFileUpload]);

  return (
    <div className="p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {uploadStatus === 'success' ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="h-12 w-12 text-red-500" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {uploadStatus === 'success'
                ? 'File uploaded successfully'
                : uploadStatus === 'error'
                ? 'Upload failed'
                : 'Upload energy consumption data'}
            </h3>
            
            {uploadStatus === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            )}
            
            {uploadStatus === 'idle' && (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag and drop your CSV file here, or click to select
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Maximum file size: 10MB
                </p>
              </>
            )}
          </div>
          
          {uploadStatus !== 'idle' && (
            <button
              onClick={() => {
                setUploadStatus('idle');
                setErrorMessage('');
              }}
              className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;