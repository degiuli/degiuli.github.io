# WinDBG

Go to [Home](Intro.md)


## Application Verifier

The [Application Verifier](http://www.microsoft.com/en-us/download/details.aspx?id=20028) is other independent tool useful for general application troubleshooting. Enabling this tool for your process allows you to catch a whole range of common programming mistakes, which include invalid handle usage, lock usage, file paths, dangerous function. It a very good practice enabling Application Verifier during the development cycle.

Some test setting can dramatically change the speedy of application execution and can cause timing-issues not to surface.

The Applications pane shows all applications currently enabled for verification. New application can be added and existent one can be removed via File menu. Be sure to save every time an change is performed.


### Application Verifier Test Setting

The Application Verifier has many test setting to find problems and they will now be quickly reviewed.

1. **Exception**: This catches any first-chance access violation that might have been inadvertently caught by the application.

2. **Handles**: Handles are used as an abstraction model to the core operating system. One of the most common problem is specifying the wrong handle value to the various APIs that accept them. This test setting checks for invalid handles, invalid thread local storage (TLS) index, invalid parameter in calls to ```WaitForMultipleObjects```, ```null``` handle value, ```DllMain``` concurrency problems, invalid handle types.

3. **Heaps**: This test setting contains powerful instrumentation on heap-related problems. It can enables instrumentation on heap block fill patterns, heap block guard pages, and stack tracing. The stack tracing capabilities are extremely powerful as they provide historic view of all allocation and deallocation made in the process. This test settings can check buffer overrun, large allocations, invalid heap handles, generic heap corruptions, buffer underrun, first-chance access violation.

4. **Locks**: Any concurrent application may sometimes exchange shared data between thread. To prevent concurrent access (reading and writing) in the data, application uses lock features to synchronize the resource access. Unfortunately, this leads to some possible issues such as deadlock. This test setting provides a range of checks, such as forgetting to free a critical section, checking for active critical section when unloading DLL, verification correctness of owner thread ID and recursion count, use prior initialization, invalid deletion of critical section, leaving an unowned critical section, private locks usage.

5. **Memory**: This test setting traps for numerous programming mistakes related to memory, such as invalid parameters for memory APIs, failed buffer initialization, module unloading, DllMain exception, thread exceptions.

6. **ThreadPool**: ThreadPool is a component to use when an application requires multiple threads. The operating system manages when and how to create a thread. Unfortunately, this brings numerous bugs from improper usage of thread pool. This test setting traps theses bugs and notifies about the potential problems in the code., such as changed thread priority, unprocessed messages.

7. **TLS**: Thread local storage (TLS) is a common mechanism used to allocate local thread specific data, done through TLS family of APIs. This test setting triggers calls to those APIs checking for ```TlsIndex``` leaks, corrupted TLS state or invalid TLS index used.

8. **FilePath**: Applications that uses the system file paths can suffer problems using wrong paths. Using this option, Win32 API will retrieve correct paths and will not cause a break, but will log the offending stack trace.

9. **HighVersionLie**: Application that rely on a hard-coded Windows version number may be broken. This test setting allows developer to test against future Windows version. The Application Verifier hooks the ```GetVersion``` and ```GetVersionEx``` APIs and return higher Windows version.

10. **InteractiveService**: Service runs under high privileges account, which may lead to security compromises. This test setting looks for interactive service and triggers user interface elements (such as Windows messages) exchange by service and the user application.

11. **KernelModeDriverInstall**: As running in kernel mode and have access to critical system data, failures in drivers can have a significant impact on the system and, in the worst case, the blue screen. This test setting monitors whether the drivers are installed using proper channels, considering the use of proper APIs.

12. **Low Resource Simulation**: This test setting helps developer to ensure the robustness of the application under condition with low resources faults should occur during execution. This test setting has several sub-settings that simulates different conditions:

* _Include_ - Controls which DLL faults should occur in. If * is used, all modules should be included in the test.

* _Exclude_ - A list of DLL that should be excluded from fault injection.

* _Timeout_ - Indicates how many milliseconds should elapsed at process startup before fault injection.

* _WAIT_ - A number from 0 to 100 that indicates the probability that the ```WaitForXXX``` APIs will fail because of fault injection.

* _HEAP_ALLOC_</span> - A number from 0 to 100 that indicates the probability that the HeapAlloc APIs will fail because of fault injection.

* _VIRTUAL_ALLOC_ - A number from 0 to 100 that indicates the probability that the VirtualAlloc APIs will fail because of fault injection.

* _REGISTRY_ - A number from 0 to 100 that indicates the probability that Registry APIs will fail because of fault injection.

* _FILE_ - A number from 0 to 100 that indicates the probability that File APIs will fail because of fault injection.

* _EVENT_ - A number from 0 to 100 that indicates the probability that Event APIs will fail because of fault injection.

* _MAP_VIEW_ - A number from 0 to 100 that indicates the probability that MapView APIs will fail because of fault injection.

* _OLE_ALLOC_ - A number from 0 to 100 that indicates the probability that OLE Alloc APIs will fail because of fault injection.

* _STACKS_ - ```TRUE``` indicates that the stack growing feature should be disable to simulate low resources and ```FALSE``` indicates the stack growth occurs.

13. **LuaPriv**: ```LuaPriv``` stands for Limited User Account Predictor and this test setting serves two purposes: (1) predicts whether an application is capable of running with reduced privileges and (2) determines possible problems when an application runs with a reduced privilege set. It can trigger failure open (parent) object, failure interpret the ```HKEY_CURRENT_USER``` registry hive and many many others failures.

14. **DangerousAPI**: This test setting checks for calls to some powerful Win32 APIs that care must be taken when using them to avoid problems that might arise when they are used. This dangerous APIs are:

* _TerminateThread_ - This API does not properly clear a thread stack and has a high chance of causing deadlocks and data corruption.

* _ExitProcess_ - It internally uses the ```TerminateThread```. Additionally, this may cause issues on other application that uses shared objects, such as a mutex.

* _LoadLibrary_ - Loading DLL can cause deadlocks or even crashes due to ```DllMain``` code.

* _FreeLibrary_ - Unloading DLL can cause deadlocks or even crashes due to ```DllMain``` code.

```LoadLibrary``` and ```FreeLibrary``` depend on the ```DLLMainCheck``` property; if ```TRUE```, this test setting will traps any call from ```DllMain``` to those APIs.

**_Important_: ```DllMain``` should be as simply as possible! Do not add too much processing code on if because this can lead to problems describe above. Also, the ```PROCESS_DETACH``` should not have any external access because the memory references will not probably be valid.**

Finally, this test setting also checks for stack commit size, which means that checks whether an application is set to not allow stack growth in cases in which stack overflow exception might be raised in low memory conditions.

15. **DirtyStack**: Uninitialized stack variables are a very common source of bugs, mainly for pointers. This test settings fills the unused portion of the stack with specific pattern. When an application attempts to use uninitialized variables, it might result in an access violation because of accessing the invalid memory resulted from fill pattern.

16. **TimeRollOver**: When working with the ```GetTickCount```, ```GetTickCount64``` and ```TimeGetTime``` APIs, it is crucial that the developer handles the cases in which rollover occurs. In order to test the rollover, this test setting enables a delay control when the rollover should occur.

17. **PrintAPI** and **PrintDriver**: Numerous problems can surface when working with the Print APIs. Both test settings enable a slew of tests to ensure proper usage of the APIs.

