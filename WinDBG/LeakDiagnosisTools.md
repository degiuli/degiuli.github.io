# WinDBG

Go to [Home](Intro.md)


## Leak Diagnosis Tools

There are two useful leak diagnosis tools that shall be discussed: ```LeakDiag``` and ```UMDH```.


### UMDH

```UMDH``` can be said as a heap manager leak tool. In addition, it requires stack tracing mode enabled by the ```gflags```. It is sightly complicated to collect leak information from using this tool. First, one need to collecting data:

1. Using an administrator account, open the command prompt and run the ```gflags``` to start coolecting the stack trace for user mode allocations: ```gflags -i Program.exe +ust```.

2. Start the Program.exe and collect a baseline snapshot (this can be done from a regular command prompt): ```umdh -pn:Program.exe -f:Dump1.txt```.

3. Perform the action that leaks memory, and collect a second snapshot: ```umdh -pn:Program.exe -f:Dump2.txt```.

4. Compare the snapshots: ```umdh -d Dump1.txt Dump2.txt > Diff.txt```.

5. Open Diff.txt in your favorite text editor (that can handle large files!). The memory leaks are listed in descending order of bytes leaked; each should be followed by the complete stack trace of the allocation call. Depending on the cause, this may either pinpoint the bug, or at least show a good place to set a breakpoint for debugging.

6. Stop the data collection. The most important step in the whole process is to turn off the data collection for your application (once the memory leak is fixed), or else your program will run slowly while the OS kernel logs every memory allocation: ```gflags -i Program.exe -ust```.
If Program.exe is not a unique process name, the ```-p:``` command line argument can select a process by ID.


### LeakDiag

```LeakDiag``` is an independent tool provided by the Microsoft. It is both console-based and user interface tool that provides information on how much memory a process has leaked with detail information such as the stack trace and allocation statistics. It includes a superset of the ```UMDH``` tool capabilities. In addition to heap manager allocation, ```LeakDiag``` can detect leaks on:

* Virtual memory allocation
* Heap memory allocation (default)
* MPHeap allocation
* COM (internal and external) allocation
* C-runtime allocation

It outputs all the information into log files in XML format, by default, in the ```C:\LeakDiag\logs``` folder and files are named by the tool to guarantee a unique filename for each run.

To collect information about a process, it can be selected in GUI and then the allocation method can be selected. Then, click on the Log and then Start buttons. When the process is completed, the LeakDiag will automatically close the trace file.
