' IronPeak Fitness — Silent Launcher
' Double-click this to start the portal without any black terminal window

Dim WshShell, strDir, strBat
Set WshShell = CreateObject("WScript.Shell")

' Get the folder where this VBS file lives
strDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
strBat = strDir & "start.bat"

' Run start.bat silently (0 = hidden window, False = don't wait)
WshShell.Run "cmd /c """ & strBat & """", 0, False

Set WshShell = Nothing
