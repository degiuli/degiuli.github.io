# WinDBG

Go to [Home](Intro.md)


## Glossary

This page gives a brief definition of some relevant keywords and expression that is going to be used along this series. This page, as the introduction, will continuously be updates as new relevant keywords and expression is added in other pages.


### Definitions

1. **Exception**:
* Exception in software is an action that is not part of the of the ordinary operation. Exception moves the execution from the current part of the code to other part of the code or system code.

2. **Unhandled exception**:
* Unhandled exception is an exception that is not dealt with the code. It can occur for many reason that will be discussed in this series posts. Unhandled exception is usually seen by the ```Kernel32!RaiseException```, which is initiate by the CPU. An application can also raise an exception, for instance using the ```throw``` statement, but neither this not the CPU exception are properly caught and handled internally by the application.

3. **Deadlocks**:
* Deadlock is a situation in which two or more concurrent thread are each waiting for other to complete its action and this never happens.
* For instance: suppose one application has two threads that access a flag protected by a mutant exclusive (mutex) or critical section. One of this thread locks the flag access but never releases and, when the second one tries to lock it will be blocked.

4. **Memory corruption**:
* Please see the [Memory Corruption](MemoryCorruption.md) page.

5. **Resource Leaks**:
* Resource is any entity that occupies space (physical or virtual memory) in system, such as handles and memory. Leaks are any resource that have been acquired or created but not properly released or deleted. For instance, a memory created using the ```new``` statement but not deleted by ```delete``` statement or a event handle created by ```CreateEvent``` API but not released by the ```CloseHandle``` API.
* Please see the [Resource Leaks](ResourceLeakes.md) page.

6. **First change exception**:
* First chance exception most often does not mean there is a problem in the code. For applications which handle exceptions gracefully, first chance exception messages let the developer know that an exceptional situation was encountered and was handled.

7. **Second change exception**:
* Second change exception is a notification for unhandled exception that will certainly prevent application from continue running.

8. **Postmortem Debugging**:
* This is simply a crash or hang dump analysis that has been collected from an ex-running application.
