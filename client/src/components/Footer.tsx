import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="pt-16">
        <footer className="bg-gray-800 text-white text-center h-20">
            <div className="container mx-auto pt-8">
                <p>&copy; {new Date().getFullYear()} ALDO Group. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
};

export default Footer;
