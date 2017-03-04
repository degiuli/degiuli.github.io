# WinDBG

Go to [Home](Intro.md)


## Global Flags (GFlags)

Global Flags, or simply ```gflags```, is a configuration tool part of the Debugging Tools For Windows package. It provides both console-mode and a graphical interface (GUI) and can configure the system to collect much more detail from a process, i.e. it instruments the process for debugging. It also instruments the system wide for kernel mode debugging, which requires a reboot.

All ```gflags``` configurations are storage in the Registry. System wide settings are located at
```
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager]
"GlobalFlag"=dword:00820502
```
while each process has an independent key
```
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\Process.exe]
"GlobalFlag"="0x121099f2"
```

The value storage into the ```GlobalFlag``` key, represents an bit setting for the corresponding configuration set. **IMPORTANT**: Unless you know exactly what are you doing, **DO NOT** update the registry directly. Instead, use the ```gflags``` either from GUI or console to set the registry value and them you can export it.

Although it providers much instrumentations features for system, this page will focus on the process instrumentation (Image File tab in graphical interface).

Now, let’s look at the console mode option, which also provides an overview of the GUI option.

Usage: ```gflags [option] [ImageName] [+/-Flag]```

The ```options``` are:

* ```-r``` controls the persistent options for system (System Registry tab)
* ```-k``` controls the kernel options (Kernel Flags tab)
* ```-i [ImageName]``` controls a process options (Image File tab)
* ```-p``` controls pageheap options (See below the ```Flags``` supported). For instance, if needed to enable application verifier for a process, the command line would be ```gflags -i Process.exe +vrf``` and to disable the page heap ```gflags -i Process.exe -hpa```

The list of Flags below gives a brief details about the ```gflags``` options:

* ```soe``` - Stop on exception
* ```sls``` - Show loader snaps (via a debug tool, e.g. DebugView, Visual Studio, WinDbg, this show information about the loading and unloading process of an DLL
* ```dic``` - Debug initial command
* ```shg``` - Stop on hung GUI
* ```htc``` - Enable heap tail checking
* ```hfc``` - Enable heap free checking
* ```hpc``` - Enable heap parameter checking
* ```hvc``` - Enable heap validation on call
* ```vrf``` - Enable application verifier
* ```ptg``` - Enable pool tagging
* ```htg``` - Enable heap tagging
* ```ust``` - Create user mode stack trace database (see [Leak Diagnosis Tools](LeakDiagnosisTools.md#UMDH)
* ```kst``` - Create kernel mode stack trace database (useful for kernel debugging mode or to debug an application that interacts much with kernel)
* ```otl``` - Maintain a list of objects for each type
* ```htd``` - Enable heap tagging by DLL
* ```dse``` - Disable stack extensions
* ```d32``` - Enable debugging of Win32 Subsystem
* ```ksl``` - Enable loading of kernel debugging symbols
* ```dps``` - Disable paging of kernel stacks
* ```scb``` - Enable system-critical breaks
* ```dhc``` - Disable heap coalesce on free
* ```ece``` - Enable close exception
* ```eel``` - Enable exception logging
* ```eot``` - Enable object handle type tagging
* ```hpa``` - Enable page heap (which is also known as ```gflags /p /enable <process> /full```
* ```dwl``` - Debug Winlogon
* ```ddp``` - Disable kernel mode DbgPrint output
* ```cse``` - Early critical section event creation
* ```ltd``` - Load DLLs top-down
* ```bhd``` - Enable bad handles detection
* ```dpd``` - Disable protected DLL verification<
* ```lpg``` - Load image using large pages if possible

**Be careful!** Some options will certainly slow down the monitored application. Also, depending on the combination of flags used, the application may not even run!

