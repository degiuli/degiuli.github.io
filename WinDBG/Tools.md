# WinDBG

Go to [Home](Intro.md)


## Debugging Tools For Windows

There are vast number of debugging tools available and Microsoft also provider lots of free tools. Perhaps the most common and important, is not actually a tool but a set of tools called **Debugging Tools for Windows** ([http://msdn.microsoft.com/en-us/windows/hardware/gg463009.aspx](http://msdn.microsoft.com/en-us/windows/hardware/gg463009.aspx)). This collection of tools is freely available as part of Windows Driver Kit (WDK) or Windows SDK. The list of tools that are part of the this package are:

* **```adplus```** - originally a vbs script and now a executable tool, is able to collect dump files from different conditions. More on the [adplus](adplus.md) page.

* **```agestore.exe```** - handy file deletion utility that deletes files based on the last access date.

* **```cdb.exe```** and **```ntsd.exe```** - both are console-based user mode debugger and are virtually identical.

* **```dbengprx.exe```** - lightweight proxy server that relays data between two different machines.

* **```dbgrpc.exe```** - tool used to query and display MS Remote Procedure Call (RPC) information.

* **```dbgsrv.exe```** - process server used for remote debugging.

* **```dumpchk.exe```** - tool used to validate a memory dump file. This tools is quite useful when the dump file is partially corrupted. For such problem, other tools may not be able to retrieve information from the file, but the ```dumpchk``` can. For this, type in the prompt: ```dumpchk -z dumpfile.dmp```.

* **```gflags.exe```** - configuration tool used to enable and disable system instrumentation. More on the [gflags](GFlags.md) page.

* **```kd.exe```** - kernel mode debugger.

* **```kdbgctrl.exe```* - tool used to control and configure a kernel mode debug connection.

* **```kdsrv.exe```** - connection server used during kernel mode debugging.

* **```kill.exe```** - console-based tool to terminate a process.

* **```logger.exe```** - tool that logs the activity of a process (such as function call).

* **```logviewer.exe```** - tool used to view log files generated by logger.exe.

* **```remote.exe```** - tool used to remotely control console programs.

* **```rlist.exe```** - remote process list viewer.

* **```symchk.exe```** - tool used to validate symbol files or download symbol files from a symbol server.

* **```symstore.exe```** - tool used to create and maintain a symbol store.

* **```tlist.exe```** - tool to list all running processes.

* **```umdh.exe```** - tool used for memory leak detection.

* **```windbg.exe```** - user mode and kernel mode debugger with a graphical user interface.

Some of those tools, which have links associated with, are discussed in much more detail in related pages.

## WinDbg

WinDbg, which will be more detailed discussed in other pages, is one of the most important tool, if not the most important. As said, it is a debugger for both live and postmortem applications.

It can be started as normal Windows application via Start menu or run from a command line. Running from command line is particularly useful because some option can instantly use when the an application is attached/started or a dump is opened.

### WinDbg command line:

#### Live debug (startup application):

```windbg -ee c++ -i <executable path>; -logo <log file name> -n -o -srcpath <application source path> -v -y <symbol path> <application.exe> <application arguments...>```

#### Live debug (for a running application):

```windbg -ee c++ -i <executable path> -logo <log file name> -n -o -srcpath <application source path> -v -y <symbol path> -pb -p <PID>```

or

```windbg -ee c++ -i <executable path> -logo <log file name> -n -o -srcpath <application source path> -v -y <symbol path> -pb -pn <unique process name>```

#### Postmortem debug:

```windbg -ee c++ -i <executable path> -logo <log file name> -n -o -srcpath <application source path> -v -y <symbol path> -z <dump file>```

#### Why are those options suggested?

```-ee``` specifies the type of the language expression supported, in that case ```C++```. It also supports ```masm```, which define the expression used is for Microsoft Assembly.

```-logo``` specifies the output log file. It will create a new file and if file already exists, it will be overwrite. If ```-loga``` is used instead and file already exists, output will be appended with new information. The output information is all information that appears in WinDbg screen. It is particularly helpful for postmortem debugging because some command can create lots of information that becomes difficult to track in the screen.

For more details, type ```windbg -?```.

Finally, virtually everything that is applied to this tool is also applied for CDB tool.