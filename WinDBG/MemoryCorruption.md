# WinDBG

Go to [Home](Intro.md)


## Memory Corruption

Errors in running application depends on the type of language in which is written, i.e. whether is a "safe" language like Java and C# or an "unsafe" language like C and C++. (C and C++ are the focus languages.) "Safe"  and "unsafe", in this context, mean how the language handle memory allocation and deallocation. In the case of "safe"  languages, memory can be allocated, but they have a garbage collector (GC) that handles the memory deallocation which prevents some incorrect memory access and some application execution problems and even security holes.

"Unsafe" languages can lead to “undefined behavior”, in which “Anything at all can happen; the Standard imposes no requirements. The program may fail to compile, or it may execute incorrectly (either crashing or silently generating incorrect results), or it may fortuitously do exactly what the programmer intended.” as stated in C FAQ.

Basically, memory corruption is what the undefined behavior means. It refers to any issue that affects an application memory. It is one of the most intractable forms of programming error either because the source of the issue and its manifestation might be far apart or because its symptoms appear under unusual conditions.

Memory corruption may happen at least one of the following conditions take place:

* The executing thread writes to a block of memory that it does not own.
* The executing thread writes to a block of memory the it does own but corrupts its state or other application memory block state.

In any case an exception is generated and this can cause application to crash. If there is no crash, application enters in an unpredictable behavior. An application may crash because it writes to memory consider invalid by the operating system. In some cases, the writing may be considered valid, but it modifies the application state. Subsequently, the application might try to use the memory incorrectly written and crashes depending on the memory access.


### Undefined behavior

An application may write bad data to the memory owned by other parts of the application, which might not cause the crash. When other part of the application access the bad data written, it changes its state in an unpredictable way which leads to unpredictable and undefined behavior, such as processing wrong instructions, show incorrect data, etc.

There are two common issue that represent the memory corruptions: [Stack Corruption](#StackCorruption) and [Heap Corruption](#HeapCorruption). Both will be discussed in later posts, but firstly we shall discuss how we can detect and fix memory corruption issues.


### How do Detect Memory Corruption

Detecting and fixing a memory corruption issue is at minimum difficult. Some occurrences can be so difficult that we may spend too much time looking for a solution.

The first one is the analysis, which consist on collect data, such as application trace, dump files and source code, when available. The tools needed to analyze the dump will be discussed later.

Source code can be followed while the traces and dumps are analyzed. This helps to understand what behavior was expected and was not performed, which function/method was performed before occurring the exception.

Based on the data collected, one can go deeper into the source code, analyzing the behavior expected and what occurred when the issue happened. One can also use a debugger tool and/or instrument the source code to test it again the conditions the application crashed. Unfortunately, lots of those conditions are certainly not easily reproduced. Tools that instrument source code and debugger tools will also be discussed later.


### Heap Corruption

When an application dynamically allocates memory, it can rely on different methods, such as C/C++ runtime heap (using the ```new```/```delete``` and ```malloc```/```calloc```/```realloc```/```free``` APIs), the default process heap, or yet application specific heaps (both use heap APIs). Eventually, all reaches the Heap Manager (NTDLL) and then Virtual Memory Manager.

Heap is one form of Windows memory manager, which applications use to allocate and deallocate memory dynamically. Windows Heap has a complex architecture that will not be discussed in much details here. Instead, let’s sum up what happens when allocation and freeing a block of memory.


#### Allocating a block of memory

The Heap manager first consults the front end allocator to see if a free block of memory is available; if it is the heap manager returns it to the caller. Otherwise, the back end allocator’s free lists are consulted and:

* If an exact size match is found, flags are updated to indicate that block is busy; the block is then removed from the free list and returned to the caller.

* If an exact size match cannot be found, the heap manager checks to see if a larger block can be split into two smaller blocks that satisfy the request allocation size. If it can, the block is split. One block has the flags updated to a busy state and is returned to the caller. The other block has its flags set to a free state and is added to the free list. The original block is also removed from the free list.

* If the free lists cannot satisfy the allocation request, the heap manager commits more memory from the heap segment, creates a new block in the committed range (flags are set to busy state), and returns the block to the caller.

The front end allocator is consulted to see if it can handle the free block. If the free block is not handled by the front end allocator, heap manager checks if there are any adjacent free block; if so, it coalesces the blocks into one large block by doing the following:

* The adjacent free blocks are removed from the free lists.

* The new large block is added to the free list or front end allocator.

* The flags flags field for the new large block is updated to indicate it is free.

If no coalescing can be performed, the block is moved into the free list or front end allocator and the flags are updated to a free state.

Front end allocator has two policies on how memory blocks are handle. The first is look aside list (LAL), which is a table of 128 singly linked list. Each singly linked list in the table contains free heap blocks of a specific size starting at 16 bytes plus 8 bytes of metadata used to manage the block. Then, 32 bytes, then 48 bytes, and so on until 1024 bytes, in the last index. The second policy is low fragmentation (LF), which reduces the fragmentation described in LAL. LAL is default in Windows XP and Windows 2003, but the LF is also supported. Windows Vista and later has LF as default.

Back end allocator contains a table of lists commonly referred to as the free list. The free list’s responsibility is to keep track of all the free heap blocks of a specific size.


#### Accessing Uninitialized Memory

Accessing uninitialized memory is a common problem in software. Essentially, uninitialized memory refers to a block of memory, either stack variable or a memory that has been successfully allocated but not initialized to a state which is considered valid.

```
int main(int> argc, char* argv[])
{
    //allocate stack variable
    size_t size;
    
    //dynamically allocate a memory
    // and using the uninitialized size
    char* pdata = new char[size];
    
    if (pdata)
    {
        std::cout << "Data: " << pdata << ", Size: " << size << std::endl;
        
        //do something here with pdata...
        
        delete [] pdata;
    }
    
    return 0;
}
```

The sample above show two possible problems related to uninitialized memory: (1) when the system allocates the ```size``` variable, its memory may contain a value large enough the end up the system memory when ```pdata``` is allocated, because the ```size``` value is unknown; (2) independently on the value of size, when the ```std::cout``` is performed, it is highly likely that it access invalid memory because it may not find the ```null``` character in the ```pdata``` memory, probably crashing the application. When the system allocates memory to ```pdata```, a pattern is used to fill that new memory and it does not contains a ```null``` character.


#### Heap Overruns and Underruns

Each heap block, as stated earlier, has a metadata, that is used by the heap manager to properly handle that block. If a faulty piece of code overwrites that data, the heap integrity is compromised and the application may crash. This usually occurs when the block size is not respected and data is written beyond the block boundaries - overruns - or before its initial position - underruns.

```
int main(int argc,char* argv[])
{
    char* pdata = new char[100];

    if(pdata)
    {
        //overrun
        memset(pdata,0x00,110);

        //underrun
        memset(&pdata[-10],0x00,100);
    }
    return 0;
}
```

Obviously, there is no reason to right such awful code. Let’s see a more realistic sample below, in which the input is saved into a internal memory and something (we don’t care) is done:

```
int main(int argc, char* argv[])
{
    char* pdata = new char[10];
    
    if (pdata && argc > 1)
    {
        strcpy(pdata, argv[1]);
        
        //do something with pdata...
    }
    
    if (pdata)
        delete [] pdata;
    
    return 0;
}
```

In case the first application argument has more than 10 characters, it will certainly modify memory out of its boundaries. This could certainly corrupt the heap and crash the application.

In addition to the crash and/or heap corruption this could also lead to other consequence that is a security hole. Similarly to the stack overrun, a hacker can also inject a piece of code to gain access to the system by using this technic.


#### Accessing Freed Memory

This is also a very common source of heap corruption. After being freed, a block is placed in the free list or front end allocation by the heap manager. From that point, it is considered invalid for application use. If the application uses it in any way, the free list will be corrupted and the application may crash.

```
int main(int argc,char8 argv[])
{
    char* pdata = new char[10];

    if (pdata)
    {
        //do something...

        delete [] pdata;

        //do something more...

        if (argc > 1)
        {
            strcpy(pdata,argv[1]);
        }
        std::cout << pdata << std::endl;
    }
    return 0;
}
```

Whether or not there is an application argument, when the ```pdata`` is invalid after ```delete``` and incorrectly accessed. In both case, the application is reusing/accessing a freed memory and corrupting the heap.


### Double Frees

An application frees some structure that it had already freed. In such a case, a subsequent reference can pick up a meaningless pointer, causing a heap segmentation violation. Possibly, the application will not crash but this can leads to unpredictable behavior.

```
int main(int argc, char* argv[])
{
    char* pdata = new char[10];
    if (pdata)
    {
        //do something...
        delete [] pdata;
    }
    
    delete [] pdata;
    return 0;
}
```

#### Erroneous Free

An application calls an unappropriated memory release method to an addresses. For instance, the application allocates a memory array using ```new[]``` but releases it using ```delete``` or allocates a memory using ```malloc``` and releases it using ```delete```.

```
int* int_new = new int;
delete [] int_new;
```
```
char* char_array = new char [10];
delete char_array;
```
```
long* long_malloc = static_cast<long*>(malloc(sizeof(long)));
delete long_malloc;
```
```
double* double_new = new double;
free(double_new);
```

This kind of issue may not lead to a application crash but certainly leads to unpredictable behavior.


#### Heap Handle Mismatch

Heap Manager keeps a list of active heaps in a process and an application can have heap handles in addition to the default one. Applications that directly accesses the Heap APIs should be take a extra care while deal with the default - taken from ```GetProcessHeap``` API - and possibly internal process heap - created using ```HeapCreate``` API.

Allocating memory using in one heap and freeing it using other may not cause visible issue at the moment, but one the mismatch occurs the heap gets corruption which later causes unpredictable behavior and access violation.


### Stack Corruption

Stack is one of the most common data structure. It is pretty simple data structure that can be equated to a stack of plates or papers, where you push a new on top of it and pop from the top of it. The top is the next to be pushed or popped. In computers, the stack is in fact the lower addresses. One very good clarification about stack is the [Eli Bendersky’s blog](http://eli.thegreenplace.net/2011/02/04/where-the-top-of-the-stack-is-on-x86/).

In Windows system, stack is just a block of memory assigned by the operating system to a running thread. Windows systems (32/64-bits) reserves 1MB for each new thread created for the stack. The stack is also used to track the function calls chain, including allocation of local variables and parameter passing. Once a function is called, a new frame is created on the stack and it will grows bigger and bigger as more and more functions are called. The way a function call grows in the stack depends on the CPU architecture (x86, ARM, RISC, PowerPC). The x86, which will be the focus of our discussion, has some calling conventions that directly affect how the data is placed on the stack.


#### x86 Calling Convention

Now, let’s look at the x86 architecture calling convention. This information may be important to understand what a dump file can show. This will also describe the how a stack is filled and the function decoration (how the compiler and linker builds the name of a function). Also, calling conventions is nothing more than a contract between the caller and callee functions. It specifies rules that both must agree.

The most important types of calling conventions are:

#### ```cdecl```

Or C declaration, originates from the C language and is defined at ```__cdecl```. Caller function should clear the stack. Parameters will be passed by via stack from right (on the top) to left (on the bottom). Also, the function will be prefixed by ‘_’.

Let’s look at the sample below:

```
int __cdecl callee(int, int, int);

int __cdecl caller(void)
{
    int ret = callee(1, 2, 3);
    ret += 5;
    return ret;
}
```

Using the assembly code, the caller will firstly, push the 3 to stack, then 2 and finally 1 before call the callee function:

```
push    $3
push    $2
push    $1
call    _callee
```

There are also few details about the registers that should be manipulated in that operation, which also depends on the type of the parameter. There are a vast number of sources that you can look for more details about this information.


##### ```stdcall```

```stdcall``` is basically used by Win32, with exceptions for variadic functions, and is defined as ```__stdcall```. Similar to the ```cdecl```, it uses the stack to pass parameter, also from left to right, but it is no longer reponsible for cleaning up the stack; the called function should clear stack. Function name are decorated with ‘_’ appended by ‘@’ followed by the number of bytes of stack space required.

Back to the ```callee``` sample above:

```
int __stdcall callee(int, int, int);
```

Its decorated name would be: ```_callee@12```, because each ```int``` parameter has 4 bytes.


##### ```fastcall```

```fastcall```, defined as ```__fastcall```, is quite similar to the ```stdcall```, except that the first two parameters is passed on ```ECX``` and ```EDX``` registers and the other are passed by stack. The called function is responsible to clear the stack and its decoration is exactly the same as ```stdcall```.


##### ```thiscall```

This is default convention for for C++ member functions that do not use variable arguments. The first parameter, which is the ```this``` parameter, is passed in ```ECX``` register, with the remainder passed on the stack as in ```stdcall```. As ```stdcall```, the called function is responsible to clear the stack. The function names are decorated by the C++ compiler in an extremely complicated mechanism that encodes the type of each parameter, among other things. This is necessary because C++ permits function overloading, so a complex decoration scheme must be used so that the various overloads have different decorated names. One interesting post about the C++ decorate names is [Microsoft C++ Name Mangling Scheme](http://mearie.org/documents/mscmangle/). There are more details in [MSDN](http://msdn.microsoft.com/en-us/library/56h2zst2.aspx).


#### Calling Conventions Mismatch

Now that stack is no longer an obscure thing in software processing, let’s start looking some stack issues. The first is the calling conventions mismatch. As introduced earlier, the different types of calling conventions lead to different way the stack is manipulated. Both caller and callee functions must agree with the rules. Let’s suppose there is DLL with one function:

```
void __stdcall DllProc(int);
```

Let's suppose the funcion only prints the argument. Let's look an application that dynamically loads the DLL and executes the function:

```
typedef int (__cdecl *DLLPROC)(int);
void CallProc(DLLPROC pProc, int arg)
{
    pProc(arg);
}

int __cdecl main(int argc,char* argv[])
{
    HMODULE hMod = LoadLibrary("DLL.dll");
    if(mod)
    {
        DLLPROC pProc = (DLLPROC)GetProcAddress(hMod,"DllProc");
        if(pProc)
        {
            CallProc(pProc,argc);
        }
        FreeLibrary(hMod);
    }
}
```

The code is can be compiled and linked. Running the application may not cause any issue and there will be an output but would not be the expected one simply because the calling conventions. The ```main``` function will not expect the ```DLL!DllProc``` to cleanup the stack, but it will as defined as ```__stdcall```. Before the ```DLL!DllProc``` returns, it is responsible to cleanup the stack, which means it will modify the registers accordingly. However, the main function will also perform the same operation because it believes the ```DLL!DllProc``` will not do it due to the fact the function pointer is set as ```__cdecl```.

This modifies the stack and causes unpredictable issues. In this specific case, it may probably run the ```DLL!DllProc``` again. If this example is run under a debugger, this will show an exception.


#### Stack Overrun

Stack overrun, also know as buffer overflow or stack buffer overflow, occurs when a thread indiscriminately overwrites portions of its call stack reserved for other purpose. Examples of this issue are overwriting the return address for a particular frame, overwriting entire frame, exhausting the stack completely. The effects of stack overrun range from crash, unpredictable behavior and even critical security holes.

One common mistake that causes this issue is copying a string to a smaller area. Take the following sample code below:

```
void foo(char* pdata)
{
    char data[10] = {0};    //stack memory
    strcpy(data,pdata);
    std::cout << data << "\n";
}

int main(int argc, char* argv[])
{
    if(argc > 1)
    {
        //pass first argument to function
        foo(argv[1]);
    }
    
    return 0;
}
```

What would happen if the ```argv[1]``` string is bigger than 10 bytes? A crash would occur because the characters beyond the 10th position, characters out of the allocated memory boundaries, would write the stack memory changing its contents, causing this memory to be invalid. If this memory is, for instance, an instruction address, it can certainly redirect the application execution to wrong path. So, the consequence is a security hole. A hacker can inject a piece of code to gain access to the system by using this technic.


#### Stack Overflow

Stack overflow usually occurs when too much memory is used on stack, which contains a limited amount of memory, usually 1MB per thread in Windows system and 8MB per thread in Unix-like systems. The memory size available on stack depends on the language used, the machine architecture, multi-threading, and the amount memory available. When an application attempts to allocate more stack memory that available, it typically crashes as a result of the overflow. The two main reason that results in stack overflow are:

* high or infinite number of recursion:
```
int foo()
{
    return foo();
}
```

* very large stack variable:
```
int foo()
{
    double very_large_array[1000000];
    
    //do something ...
    
    return 0;
}
```

There are two basic rules to avoid this issue: (1) be care when doing recursion, always verifying completely the out case there is no infinite recursion or it is called so many times; (2) do not use much stack variable by allocating any large variable or too many variables, which also can starve the stack memory.


#### Stack Underrun

Stack underrun errors as less common, but it can occurs when the stack to be read becomes empty.
