import React from 'react';

interface SimplePageProps {
  title: string;
  content: string;
}

const SimplePage: React.FC<SimplePageProps> = ({ title, content }) => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">{title}</h1>
      <div className="prose prose-lg text-gray-600">
        <p>{content}</p>
        <p className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  );
};

export default SimplePage;
