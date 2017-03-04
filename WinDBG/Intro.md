# WinDBG

This pages has information about the WinDBG and some ideas of how to analyze dump files on Windows system.
It was initially created to help myself when dealing with crashes and debugging. I then updated for the my colleges in the company I work.


## Introduction

For now and next few pages, I will put together some information related to Windows Debugging I have been studying and using. The idea is to share some details to help Windows app developers and support team to find bugs in app faster. Not only when the app was shipped but also during development cycle.

The topics to be discussed you can see below in the content section below that will be updated every time new one is published. So, you will be able to find all series references into one single place.

**Remember**: this series is an introduction and you can find much more detailed information along the web. During the development of this series, I will show some interesting sites for you to improve you knowledge.

_Thank you!_


## What is Debug?

Roughly speaking, it can mean “find and remove bugs”. My understanding is that debug originally meant that. However, I now consider debugging much more and includes “improve code”, “check code consistency” and many others. I understand that debug can be a very powerful tool to help us out to create and optimize good and consistency code and consequently software and products.

In addition to find and remove bugs, I particularly use debug tools to look inside the code, find dangerous pieces of software, prevent leaks and deadlocks, optimize code execution and memory usage, prevent unhandled exceptions, close security holes.

My intention with this series is to put all my knowledge together. I will try to show in the pages tools that can help you in all items.


## Content

1. [Tools](Tools.md)
2. [Glossary](Glossary.md)
3. [Leak Diagnosis Tools](LeakDiagnosisTools.md)
4. [Application Verifier](ApplicationVerifier.md)
5. [GFlags](GFlags.md)
6. [WinDBG](WinDBG.md)
7. [Memory Corruption](MemoryCorruption.md)


## License

The MIT License (MIT)

Copyright (c) 2012-2017 Fabio Lourencao De Giuli [http://degiuli.github.io](http://degiuli.github.io)

Copyright (c) 1998-2017 De Giuli Informatica Ltda. [http://www.degiuli.com.br](http://www.degiuli.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.