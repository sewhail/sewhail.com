'use client';

import { Sun, Moon, Github, Twitter, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

export default function Page() {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-2xl mx-auto px-6 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-[10px] font-light tracking-wide transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                [about]
              </button>
              <button
                onClick={() => scrollToSection('current')}
                className={`text-[10px] font-light tracking-wide transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                [current]
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-[10px] font-light tracking-wide transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                [contact]
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`h-6 w-6 p-0 rounded-none ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {isDark ? <Sun className="h-2.5 w-2.5" /> : <Moon className="h-2.5 w-2.5" />}
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section
          id="about"
          className={`mb-16 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
          <div className="mb-6">
            <h1 className={`text-sm font-light mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>$ whoami</h1>
            <p className={`text-xs font-light ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>suhail@portfolio:~</p>
          </div>

          <p className={`text-xs leading-relaxed mb-4 max-w-xl font-light ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            software engineer // amsterdam, the netherlands<br />
            web development + machine learning<br />
            building meaningful digital experiences
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0.5 rounded-none font-light ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-600'}`}
            >
              fullstack
            </Badge>
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0.5 rounded-none font-light ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-600'}`}
            >
              ml/ai
            </Badge>
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0.5 rounded-none font-light ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-400 text-gray-600'}`}
            >
              oss
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-5 text-[10px] px-2 rounded-none font-light ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => scrollToSection('contact')}
            >
              <Mail className="h-2.5 w-2.5 mr-1" />
              mail
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-5 text-[10px] px-2 rounded-none font-light ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              asChild
            >
              <a href="https://github.com/sewhail" target="_blank" rel="noopener noreferrer">
                <Github className="h-2.5 w-2.5 mr-1" />
                github
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-5 text-[10px] px-2 rounded-none font-light ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              asChild
            >
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-2.5 w-2.5 mr-1" />
                twitter
              </a>
            </Button>
          </div>
        </section>

        {/* Current Ongoings Section */}
        <section id="current" className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] ${isDark ? 'text-green-500' : 'text-green-600'}">●</span>
            <h2 className={`text-xs font-light tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>/current</h2>
          </div>

          <div className="space-y-1">
            {[
              { prefix: '>', text: 'exploring ml fundamentals' },
              { prefix: '>', text: 'mathematical concepts deep dive' },
              { prefix: '>', text: 'advancing python skills' },
              { prefix: '>', text: 'building practical projects' },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 px-2 py-1 transition-all duration-200 hover:translate-x-1 cursor-pointer ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-100/30'
                  }`}
              >
                <span className={`text-[10px] font-light ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.prefix}</span>
                <span className={`text-[10px] font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className={`text-xs font-light tracking-wide mb-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>/skills</h2>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-1.5">
            {['js', 'py', 'react', 'node', 'ts', 'psql', 'docker', 'aws'].map((skill) => (
              <div key={skill} className={`px-2 py-1 text-center border ${isDark ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-gray-50/30'}`}>
                <span className={`text-[9px] font-light ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-8">
          <h2 className={`text-xs font-light tracking-wide mb-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>/contact</h2>

          <Card className={`border rounded-none ${isDark ? 'border-gray-800 bg-gray-900/20' : 'border-gray-200 bg-gray-50/20'}`}>
            <CardContent className="p-3">
              <p className={`text-[10px] mb-3 font-light ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                open to opportunities + collaborations.<br />
                feel free to reach out.
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Mail className="h-2.5 w-2.5" />
                  <a href="mailto:sxhail@outlook.in" className={`text-[10px] font-light hover:underline ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    sxhail@outlook.in
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-none" asChild>
                    <a href="https://github.com/sewhail" target="_blank" rel="noopener noreferrer">
                      <Github className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-none" asChild>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-none" asChild>
                    <a href="https://www.linkedin.com/in/sewhail/" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className={`border-t mt-12 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className={`flex items-center justify-center text-[9px] font-light ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            <span>© 2024 suhail</span>
            <Separator orientation="vertical" className="mx-2 h-2" />
            <span>next.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
