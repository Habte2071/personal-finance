import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        &copy; {new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
      </p>
      <p className="mt-1 space-x-2">
        {/* <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link> */}
      Privacy Policy

        <span>|</span>
        {/* <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link> */}
      Terms of Service

        <span>|</span>
        <Link href="/contact" className="hover:underline">
          Contact Us
        </Link>
      </p>
    </footer>
  );
}