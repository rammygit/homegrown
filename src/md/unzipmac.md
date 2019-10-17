Install the p7zip from homebrew. 

```bash
brew install p7zip 
```

to extract all files without using directory names. 

```bash
7z e <archive name>
```

to extract with full paths, 

```bash
7z x <archive name>
```

to extract to new directory,

```bash
7z x -o<folder name> <archive name>
```

**There are 3 binaries included with this** 

* 7z - handles lot diff archive formats and uses plugins to handle. 
* 7za - handles less diff formats. 
* 7zr - handles less diff formats and a lighter version of 7za. 
