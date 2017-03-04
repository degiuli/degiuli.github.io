# WinDBG

Go to [Home](Intro.md)


## ADPlus

ADPlus is a tool that is part of the [Debugging Tools for Windows](Tools.md). It was originally a VB script that used the CDB tool. Later, it also becomes an executable.

It acts as a process monitor capable of generating dump files whenever a crash. It can also creates dump file from a hang application. Additionally, it has a notification mechanism that can notify user of a crash.

To create dump files from both crash and hangs, it highly recommend to enable some [global flags](GFlags.md) for the faulting application. For crashing application heap can be enabled and for hanging one, stack trace can be enabled.

Usage:

* ```adplus -Crash -pn “ImageName.exe” [-o <dump_dir>]```
* ```adplus -Hang -pn “ImageName.exe” [-o <dump_dir>]```

The first creates dump file for both first and second chance exceptions while the second create a dump file for a hanging application and then put all logs and dump file into a ```Crash/Hang_XXX``` folder inside the adplus folder or in the ```dump_dir``` when option ```-o``` is specified.

Other information can be found at MSDN Support at [http://support.microsoft.com/kb/286350/en-us](http://support.microsoft.com/kb/286350/en-us) about how to use ADPlus.vbs to troubleshoot "hangs" and "crashes".
