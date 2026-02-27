
export default function Footer() {
  return (
    <footer className="bg-background border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} BearShare. All rights reserved.
      </div>
    </footer>
  );
}