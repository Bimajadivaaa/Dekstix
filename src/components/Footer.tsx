export function Footer() {
  return (
    <footer className="px-6 text-center mt-10">
      <hr />
      <p className="text-gray-600 text-sm mt-4 pb-5">
        &copy; {new Date().getFullYear()} Dekstix. All rights reserved.
      </p>
    </footer>
  );
}
