# WinDBG

Go to [Home](Intro.md)


## ```!analyze``` extension command

As part of the [Debugging Tools for Windows](Tools.md), WinDbg is a very known debugging tool that can use for both live and postmortem debug, user and kernel mode with a graphical user interface.

The focus of this command will be the ```!analyze``` extension command. Its goals is to automatic analyze failures, detecting and assigning to known problems of dumps. Its parameters are:

```
!analyze -v -hang
```

The former is used for crash dumps and latter for hanging dumps.

Both commands bring a list of information that help us to track the problem. The details description of the command output is discussed in following list:

```FAULTING_IP``` shows the value of the instructions pointer when the fault occurred:

```
FAULTING_IP:
kernel32!RaiseException+53
7c812afb 5e              pop     esi
```

```EXCEPTION_RECORD``` gives more detail about the exception that occurred in the form of an exception record:

```
EXCEPTION_RECORD:  1e77e998 -- (.exr 0x1e77e998)
.exr 0x1e77e998
ExceptionAddress: 7c812afb (kernel32!RaiseException+0x00000053)
   ExceptionCode: e0434352 (CLR exception)
  ExceptionFlags: 00000001
NumberParameters: 5
   Parameter[0]: 80131500
   Parameter[1]: 00000000
   Parameter[2]: 00000000
   Parameter[3]: 00000000
   Parameter[4]: 79140000
```

```ExceptionAddress``` shows the address where the exception occurred; ```ExceptionCode``` tells us the exact exception that caused the fault; ```ExceptionFlag``` show the flag associated with the exception; ```NumberParameters``` tells us the number of parameters associated with exception.

```FAULTING_THREAD```> tells us which thread caused the fault to occur:

```
FAULTING_THREAD:  ffffffff
```

In this specific case, the thread id was not saved, but it is possible to determine which thread caused the fault using other command that will be discussed later.

```BUGCHECK_STR``` represents a textual description of the ‘bugcheck’ that occurred:

```
BUGCHECK_STR:  APPLICATION_FAULT_CLR_EXCEPTION_WRONG_SYMBOLS
```

```PROCESS_NAME``` tells us the name of the process that exhibiting the fault:

```
PROCESS_NAME:  devenv.exe
```

```ERROR_CODE``` tells us the error code (```NTSTATUS```) that caused the fault:

```
ERROR_CODE: (NTSTATUS) 0xe0434f4d - <Unable to get error code text>
```

Unfortunately, there is no text information, but in most of cases, there is the information. In lost of cases the text information is not provided, it is possible to identify it by analyzing the content of the id. In this specific case it is possible to infer the code is an **e0** ‘COM’ (**43** = ‘C’, **4f** = ‘O', **4d** = ‘M’).

Other details can be obtained from Windows ```EXCEPTION_RECODE``` structure at [http://msdn.microsoft.com/en-us/library/windows/desktop/aa363082(v=vs.85).aspx](http://msdn.microsoft.com/en-us/library/windows/desktop/aa363082(v=vs.85).aspx).

```DEFAULT_BUCKED_ID``` details the general category of fault that this particular fault falls under:

```
DEFAULT_BUCKET_ID:  CLR_EXCEPTION
```

```PRIMARY_PROBLEM_CLASS``` indicates the primary class of the problems that the fault was categorized in

```
PRIMARY_PROBLEM_CLASS:  CLR_EXCEPTION
```

```LAST_CONTROL_TRANSFER``` shows the last two functions calls made on the stack:

```
LAST_CONTROL_TRANSFER:  from 7928bd60 to 7c812afb
```

The ```ln <address>``` command shows the name of the function associated with the address. In this sample, the control was transferred from ```kernel32!RaiseException``` to ```clr!RaiseTheExceptionInternalOnly```. This information can also be taken from the stack trace.

```STACK_TEXT``` shows the stack trace of the thread:

```
STACK_TEXT:  
7c812afb kernel32!RaiseException+0x53
7928bd60 clr!RaiseTheExceptionInternalOnly+0x276
7928bf99 clr!IL_Throw+0x14c
0f840c32 Microsoft_Build_ni+0x380c32
0f5b88eb Microsoft_Build_ni+0xf88eb
0f5b8718 Microsoft_Build_ni+0xf8718
79b2ae5b mscorlib_ni+0x2aae5b
79ab7ff4 mscorlib_ni+0x237ff4
79ab7f34 mscorlib_ni+0x237f34
79b2ade8 mscorlib_ni+0x2aade8
791421bb clr!CallDescrWorker+0x33
79164be2 clr!CallDescrWorkerWithHandler+0x8e
79164d84 clr!MethodDesc::CallDescr+0x194
79164db9 clr!MethodDesc::CallTargetWorker+0x21
79294073 clr!ThreadNative::KickOffThread_Worker+0x1e1
792f0d78 clr!Thread::DoExtraWorkForFinalizer+0x114
792f0dfa clr!Thread::ShouldChangeAbortToUnload+0x101
792f0eb5 clr!Thread::ShouldChangeAbortToUnload+0x399
792f0f51 clr!Thread::ShouldChangeAbortToUnload+0x43a
79293f46 clr!ManagedThreadBase::KickOff+0x15
79293e41 clr!ThreadNative::KickOffThread+0x23e
792ec060 clr!Thread::intermediateThreadProc+0x4b
7c80b729 kernel32!BaseThreadStart+0x37
```

```FOLLOWUP_IP``` shows the instruction that most likely caused the fault:

```
FOLLOWUP_IP: 
clr!RaiseTheExceptionInternalOnly+276
7928bd60 c745fcfeffffff  mov     dword ptr [ebp-4],0FFFFFFFEh
```

One very important note regarding this and the ```STACK_TEXT``` field is: **DO NOT ALWAYS BELIEVE ON THEM!** The dump may show them as the caused of the fault directly, but, as discussed in corruption page, unpredictable behavior may have led to this point, when the real root of the fault is far away behind! This shall be discussed later.

```SYMBOL_STACK_INDEX``` corresponds to the frame in the thread’s stack trace that caused the fault:

```
SYMBOL_STACK_INDEX:  1
```

```FOLLOWUP_NAME``` and ```FOLLOWUP``` show who should be following up with this particular fault:

```
FOLLOWUP_NAME:  MachineOwner
```

By default, ```MachineOwner``` is used but this can be changed modifying the ```triage.ini``` file, located at the triage folder in the debugger installation path. You can either ignore a module, or part of it, or associated one module, or part of it, to a specified triage group or person. See the samples below:

```
nt!Zw*=ignore
```

This means the any fault on ```Zw*``` function of ```NT``` module will be ignored.

```
AppSample!*=Support Team (SupportTeam@AppSampleCompany.com)
```

This means that any fault on ```AppSample``` module the ```FOLLOWUP_NAME``` field will be filled with Support Team information.

```MODULE_NAME``` states the module that is exhibiting the fault:

```
MODULE_NAME: clr
```

```IMAGE_NAME``` states the name of the image that fault occurred:

```
IMAGE_NAME:  clr.dll
```

```DEBUG_FLR_IMAGE_TIMESTAMP``` shows the image time stamp where the fault occurred:

```
DEBUG_FLR_IMAGE_TIMESTAMP:  4e181a6d
```

```SYMBOL_NAME``` shows the symbolic name where the fault occurred:

```
SYMBOL_NAME:  clr!RaiseTheExceptionInternalOnly+276
```

```STACK_COMMAND``` shows the command that were executed to get the stack trace for the faulting thread:

```
STACK_COMMAND:  .cxr 1E77E9C0 ; kb ; dds 1e77ec8c ; kb
```

This field helps to understand the steps performed by the ```!analyze``` extension command. More details about the command performed above and others will be discussed later.

```FAILURE_BUCKET_ID``` and ```BUCKET_ID``` show the specific category of the problems that the fault falls under:

```
FAILURE_BUCKET_ID:  CLR_EXCEPTION_e0434f4d_clr.dll!RaiseTheExceptionInternalOnly
BUCKET_ID:  APPLICATION_FAULT_CLR_EXCEPTION_WRONG_SYMBOLS_clr!RaiseTheExceptionInternalOnly+276
```

This information can be used by the ```!analyze``` extension command to determine what additional information to display in the analysis result.

```CONTEXT``` shows the fault context address and registers at the moment of the fault occurred:

```
CONTEXT:  1e77e9c0 -- (.cxr 0x1e77e9c0)
.cxr 0x1e77e9c0
eax=1e77ec90 ebx=00000005 ecx=00000000 edx=0000004b esi=1e77ed50 edi=161a9158
eip=7c812afb esp=1e77ec8c ebp=1e77ece0 iopl=0         nv up ei pl nz na pe nc
cs=001b  ss=0023  ds=0023  es=0023  fs=003b  gs=0000             efl=00000206
kernel32!RaiseException+0x53:
7c812afb 5e              pop     esi
.cxr
Resetting default scope
```

The ```1e77e9c0``` address is the context of the fault. This field also shows the same information provided by the ```FAULTING_IP``` field.

The order the data is exhibited depends on the type of the fault. Furthermore, there may be other details depending on the fault. For instance, in case of a hang (```!analyze -v -hang```), one may see the following details:

```CRITICAL_SECTION``` shows the address of the critical section tha was found and analyzed in the starting thread.

```BLOCKING_THREAD``` gives the ID of the thread that is blocking on the critical section shown in ```CRITICAL_SECTION``` field.

```DERIVED_WAIT_THREAD``` is at the heart of the hang analysis capabilities of the ```!analyze``` extension command. When the command runs, it attempts to derive how the wait chain looks for each of the threads in the process associated with the critical section listed in the CRITICAL_SECTION field. It tries to retrieve which thread is waiting for the critical section and which thread owns it.

```WAIT_CHAIN_COMMAND``` shows the commands that can be used to further analyze the wait chain of the problematic lock.

Additionally, if the application is instrumented, for instance using the Application Verifier and/or ```gflags```, more fields can be seen in the ```!analyze``` extension command result.

```NTGLOBALFLAG``` shows the flags enabled by the ```gflags```:

```
NTGLOBALFLAG:  0
```

In this case, there were not flags enabled for the fault module.

```APPLICATION_VERIFIER_FLAGS``` shows the flags enabled using the Application Verifier:

```
APPLICATION_VERIFIER_FLAGS:  0
```

All samples above came from a real crash in the Visual Studio 2010, while I was running my application under debug mode. The application was flagged by both ```gflags``` and Application Verifier, but I had not set them for the VS. That means the system had those tools installed. If, on the other hand, the system does not have them, those fields will not appear in the ```!analyze``` extension command result.


## More commands

The WinDBG has other commands that can be used in addition to the ```!analyze``` one and help to go further into the analysis.

The number of commands and its parameter are huge and they can be seen through the WinDbg help. Here, thread and stack related command will be introduced. All options listed here should be executed in the WinDbg window command line. Finally, the list is not particularly grouped.


### ```~``` thread command

This command list all thread, its state, id and environment block address (TEB). The ```.``` (thread 36) indicates which thread was running when the debug stopped or dump was created.

```
0:036> ~
   0  Id: 109c.1700 Suspend: 0 Teb: 7ffdf000 Unfrozen
   1  Id: 109c.3ac Suspend: 0 Teb: 7ffdb000 Unfrozen
   2  Id: 109c.86c Suspend: 0 Teb: 7ffd9000 Unfrozen
   3  Id: 109c.b90 Suspend: 0 Teb: 7ffd8000 Unfrozen
   4  Id: 109c.e58 Suspend: 0 Teb: 7ffd6000 Unfrozen
   5  Id: 109c.156c Suspend: 0 Teb: 7ffd5000 Unfrozen
   6  Id: 109c.2e4 Suspend: 0 Teb: 7ff4f000 Unfrozen
   7  Id: 109c.14dc Suspend: 0 Teb: 7ff4e000 Unfrozen
   8  Id: 109c.1400 Suspend: 0 Teb: 7ff4d000 Unfrozen
   9  Id: 109c.e50 Suspend: 0 Teb: 7ff4c000 Unfrozen
  10  Id: 109c.fe4 Suspend: 0 Teb: 7ff4a000 Unfrozen
  11  Id: 109c.1180 Suspend: 0 Teb: 7ff48000 Unfrozen
  12  Id: 109c.8a8 Suspend: 0 Teb: 7ff47000 Unfrozen
  13  Id: 109c.1428 Suspend: 0 Teb: 7ffdd000 Unfrozen
  14  Id: 109c.be4 Suspend: 0 Teb: 7ff4b000 Unfrozen
  15  Id: 109c.e30 Suspend: 0 Teb: 7ff42000 Unfrozen
  16  Id: 109c.11ac Suspend: 0 Teb: 7ff41000 Unfrozen
  17  Id: 109c.a78 Suspend: 0 Teb: 7ff40000 Unfrozen
  18  Id: 109c.1354 Suspend: 0 Teb: 7ff3f000 Unfrozen
  19  Id: 109c.eec Suspend: 0 Teb: 7ff3e000 Unfrozen
  20  Id: 109c.1454 Suspend: 0 Teb: 7ff3d000 Unfrozen
  21  Id: 109c.1768 Suspend: 0 Teb: 7ff3c000 Unfrozen
  22  Id: 109c.1474 Suspend: 0 Teb: 7ff3b000 Unfrozen
  23  Id: 109c.14ac Suspend: 0 Teb: 7ff3a000 Unfrozen
  24  Id: 109c.11f8 Suspend: 0 Teb: 7ff39000 Unfrozen
  25  Id: 109c.8cc Suspend: 0 Teb: 7ff38000 Unfrozen
  26  Id: 109c.b80 Suspend: 0 Teb: 7ff34000 Unfrozen
  27  Id: 109c.1188 Suspend: 0 Teb: 7ff33000 Unfrozen
  28  Id: 109c.17f4 Suspend: 0 Teb: 7ff32000 Unfrozen
  29  Id: 109c.d50 Suspend: 0 Teb: 7ff31000 Unfrozen
  30  Id: 109c.820 Suspend: 0 Teb: 7ff43000 Unfrozen
  31  Id: 109c.13dc Suspend: 0 Teb: 7ff2d000 Unfrozen
  32  Id: 109c.11fc Suspend: 0 Teb: 7ff2c000 Unfrozen
  33  Id: 109c.48c Suspend: 0 Teb: 7ff2a000 Unfrozen
  34  Id: 109c.4c4 Suspend: 0 Teb: 7ff29000 Unfrozen
  35  Id: 109c.264 Suspend: 0 Teb: 7ff28000 Unfrozen
. 36  Id: 109c.c30 Suspend: 0 Teb: 7ff44000 Unfrozen
  37  Id: 109c.124c Suspend: 0 Teb: 7ff27000 Unfrozen
  38  Id: 109c.938 Suspend: 0 Teb: 7ff49000 Unfrozen
  39  Id: 109c.1228 Suspend: 0 Teb: 7ffd7000 Unfrozen
  40  Id: 109c.fac Suspend: 0 Teb: 7ff36000 Unfrozen
  41  Id: 109c.20e0 Suspend: 0 Teb: 7ffde000 Unfrozen
  42  Id: 109c.1090 Suspend: 0 Teb: 7ff30000 Unfrozen
  43  Id: 109c.25bc Suspend: 0 Teb: 7ff1f000 Unfrozen
  44  Id: 109c.26b4 Suspend: 0 Teb: 7ff37000 Unfrozen
  45  Id: 109c.6c4 Suspend: 0 Teb: 7ff26000 Unfrozen
  46  Id: 109c.1a6c Suspend: 0 Teb: 7ffdc000 Unfrozen
  47  Id: 109c.b2c Suspend: 0 Teb: 7ff2e000 Unfrozen
  48  Id: 109c.1da8 Suspend: 0 Teb: 7ff45000 Unfrozen
```

This command has few interesting parameters, such as ```~~[PID]``` that gives information from a specific thread.

### ```kP [number]``` detail stack

This command collects the stack of the current from the last instruction to the _[number]th_ instruction. If _[number]_ is 10, the command will listed only the last 10 instructions. What is really interesting with this command is that it may be able to retrieve the list of parameters and its contents in addition to the common ```k``` command (which retrieves the stack, function address and the source line info when available).

This command can also be combined with thread commands to evaluate stack of all thread form instance: ```~*kP 100``` or a single thread ```~[thread] kP 100```, where _[thread]_ is number of the thread retrived by the ```~``` command.


### ```.ecxr``` exception context

This command directs the debugger to the exception context, i.e. to the thread and instruction that caused the exception, when this is the case. It reports the registers states, the function address and the assembly instruction that caused the exception. After executing this command, the ```kP``` command retrieves the exactly stack of the the failed thread.

Most of the cases, the ```!analyze -v``` command, points to the correct exception context. However, during the debugging process, this context can be far way and this command set it back. Additionally, there are few times the ```!analyze -v``` command does not end the exception context. So applying this command will help much.


### ```d[opt] <address>``` command set

The ```d``` commands are a set of commands that retrieve the state of the memory address. Each existent ```[opt]``` of ```d``` command set display a memory range in different mode:

1. ```da``` - ASCII form
2. ```du``` - Unicode form

3. ```db``` - byte and ASCII form:

```0:000> db 0x0984ad38
0984ad38  50 65 72 20 66 61 72 65-20 75 6e 61 20 73 65 67  Per fare una seg
0984ad48  6e 61 6c 61 7a 69 6f 6e-65 20 6f 20 70 6f 72 72  nalazione o porr
0984ad58  65 20 75 6e 61 20 64 6f-6d 61 6e 64 61 2c 20 63  e una domanda, c
0984ad68  6f 6e 74 61 74 74 61 72-65 20 75 6e 61 20 64 65  ontattare una de
0984ad78  6c 6c 65 0d 0a 73 65 67-75 65 6e 74 69 20 72 69  lle..seguenti ri
0984ad88  73 6f 72 73 65 20 61 7a-69 65 6e 64 61 6c 69 3a  sorse aziendali:
0984ad98  0d 0a 2e 2e 20 49 6c 20-74 75 6f 20 73 75 70 65  .... Il tuo supe
0984ada8  72 76 69 73 6f 72 65 20-6f 20 75 6e 20 61 6c 74  rvisore o un alt
```

4. ```dw``` - 2-byte word; ```dW``` - 2-bytes word and ASCII; ```dd``` - 4-byte double word; ```dc``` - 4-byte double word and ASCII; ```dq``` - 8-byte quad word

5. ```dyb``` - binary and byte form:

```
0:000> dyb 0x0984ad38
          76543210 76543210 76543210 76543210
          -------- -------- -------- --------
0984ad38  01010000 01100101 01110010 00100000  50 65 72 20
0984ad3c  01100110 01100001 01110010 01100101  66 61 72 65
0984ad40  00100000 01110101 01101110 01100001  20 75 6e 61
0984ad44  00100000 01110011 01100101 01100111  20 73 65 67
0984ad48  01101110 01100001 01101100 01100001  6e 61 6c 61
0984ad4c  01111010 01101001 01101111 01101110  7a 69 6f 6e
0984ad50  01100101 00100000 01101111 00100000  65 20 6f 20
0984ad54  01110000 01101111 01110010 01110010  70 6f 72 72
```

6. ```dyd``` - binary and 4-byte double word

It is possible to continue looking at the memory block by typing the same command. For instance, after typing ```db 0x0984ad38```, the ```db``` without address will show the next block from ```0984ada8+0x10```:

```
0984adb8  72 6f 20 6d 65 6d 62 72-6f 20 64 65 6c 6c 61 20  ro membro della 
0984adc8  64 69 72 69 67 65 6e 7a-61 20 61 7a 69 65 6e 64  dirigenza aziend
0984add8  61 6c 65 0d 0a 2e 2e 20-55 6e 20 72 61 70 70 72  ale.... Un rappr
0984ade8  65 73 65 6e 74 61 6e 74-65 20 64 65 6c 6c 65 20  esentante delle 
0984adf8  72 69 73 6f 72 73 65 20-75 6d 61 6e 65 0d 0a 2e  risorse umane...
0984ae08  2e 20 55 6e 20 43 68 69-65 66 20 43 6f 6d 70 6c  . Un Chief Compl
0984ae18  69 61 6e 63 65 20 4f 66-66 69 63 65 72 20 28 72  iance Officer (r
0984ae28  65 73 70 6f 6e 73 61 62-69 6c 65 20 70 65 72 20  esponsabile per 
```

This is possible for all ```d``` command set.

## Interesting Sequence

After having shown some commands and options, how would they be used together? The answer depends on which sort of error. In any case, however, there is an interesting sequence that can be used to after the ```!analyze -v``` command. The sequence is:

* ```.ecxr``` - go to the exception context - may not be needed
* ```kP 100``` - last 100 calls on the stack

## Conclusion

Beside the commands and options shown above, the Internet has a vast number of useful sites and blogs that provider further information, tips and tricks, such as:

* ntdebugging - Advanced Windows Debugging and Troubleshooting from MSDN: [http://blogs.msdn.com/b/ntdebugging/(http://blogs.msdn.com/b/ntdebugging/">http://blogs.msdn.com/b/ntdebugging/)
* Crash Dump Analysis: [http://www.dumpanalysis.org/blog/](http://www.dumpanalysis.org/blog/">http://www.dumpanalysis.org/blog/)

Both sites above has much more information than simply a list of commands. They also show how to use them, inform details about the error, etc.

* Common WinDbg Commands (Thematically Grouped): [http://windbg.info/doc/1-common-cmds.html](http://windbg.info/doc/1-common-cmds.html">http://windbg.info/doc/1-common-cmds.html)

This one is basically the same information found in the WinDbg help, but in one single page. Additionally, this site has a [forum](http://windbg.info/forum/10-windbg-related-discussions.html) about related to WinDbg, but it may not be so useful as expected.
