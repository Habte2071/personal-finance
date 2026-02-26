'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Mail,
  Phone,
  Send,
  Copy,
  Check,
  Instagram,
  Twitter,
  Github,
  Linkedin,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: 'Copied!',
      description: `${label} has been copied to clipboard.`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? 'block' : 'hidden'} 
            md:block md:w-64 lg:w-72
            fixed inset-y-0 left-0 top-16 z-40 w-64
            md:static md:z-auto
          `}
        >
          <Sidebar onLinkClick={closeSidebar} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Decorative header */}
              <div className="text-center mb-12 relative">
                <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
                  <Sparkles className="h-32 w-32 text-indigo-400 animate-pulse" />
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Let us  Connect
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  We would love to hear from you. Whether you have a question, feedback, or just want to say hi — reach out any way you like.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Email Card */}
                <Card className="group border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">danieleliaswy@gmail.com</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => window.location.href = 'mailto:danieleliaswy@gmail.com'}
                      >
                        Send
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => copyToClipboard('danieleliaswy@gmail.com', 'Email')}
                      >
                        {copied === 'Email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone Card */}
                <Card className="group border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">+251930322071</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => window.location.href = 'tel:+251930322071'}
                      >
                        Call
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => copyToClipboard('+251930322071', 'Phone')}
                      >
                        {copied === 'Phone' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Telegram Card */}
                <Card className="group border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/50 dark:to-sky-800/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <Send className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Telegram</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">@Daniconn</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => window.open('https://t.me/Daniconn', '_blank')}
                      >
                        Send Message
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => copyToClipboard('@Daniconn', 'Telegram')}
                      >
                        {copied === 'Telegram' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map (unchanged) */}
              <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl mb-12 group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 mix-blend-overlay" />
                <iframe
                  title="Location - Addis Ababa"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126115.12833067377!2d38.704509!3d8.9806034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  className="group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Social Links (unchanged) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Access the repository on github
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">Stay connected </p>
                </div>
                <div className="flex gap-4">
                 
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                    onClick={() => window.open('https://github.com/Habte2071/personal-finance', '_blank')}
                  >
                    <Github className="h-5 w-5" />
                  </Button>
               
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
