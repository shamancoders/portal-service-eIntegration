
@echo off

for %%a in ("%cd%") do set CurDir=%%~na


git add *
git status

set /p aciklama=commit aciklama giriniz :
if NOT "%aciklama%"=="" (git commit -m "%aciklama%" & git push)

cd C:\arge\ganygo\_dist

call :distHazirla %CurDir%


exit 0


:distHazirla
SET folder=%~1
SET zipName=
FOR /f "tokens=1,2 delims=\" %%a IN ("%~1") do SET folder=%%a & SET zipName=%%b
IF "%zipName%"=="" SET zipName=%~1

rem echo folder : %folder%
rem echo zipName : %zipName%.zip

del %zipName%.zip

mkdir %zipName%
robocopy c:\arge\ganygo\%~1 %zipName% /NS /NC /NFL /NDL /NJH /NJS /XD node_modules .git downloads *temp* vendor /XF *.bat .gitignore "package-lock.json" config*.json "* - Copy.*" *private* /MIR

F:\apps\7z.exe a -tzip %zipName%.zip .\%zipName%\* -r -bd

del  %zipName%\* /s/a/q
rmdir %zipName% /s/q

EXIT /B 0