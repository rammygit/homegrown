
# How to write Linux ISO to USB Bootable drive

Basically these list of commands will do in mac.

Find the list of disks and look for your USB. 
```
diskutil list


```

2. Format the USB. In this case I am formatting disk2, replace it accordingly from the previous step

```
diskutil partitionDisk /dev/disk2 1 "Free Space" "unused" "100%"
```

3. Using `dd` command flash the iso ( any other image format ) directly to USB. In this case I was writing the Ubuntu mate into bootable USB.

`P.S: bs=10m , this is basically the block size. go with the default good number 1m. If you have SSD we can try for 10m. I didn't see any issues with them.`

```
sudo dd if=ubuntu-mate-18.04.3-desktop-amd64.iso of=/dev/disk2 bs=10m
```

Step 3 will take its own sweet time , for me it was around 15-20 mins. Mine was SSD hard drive. once this step is complete. 

4. Eject the disk / USB 

```
diskutil unmountDisk /dev/disk2
```

Now you have the bootable USB for you to use. 

Alternatively , Ubuntu suggests `Etcher`, a cross platform solution, you can find it [here](https://www.balena.io/etcher/). [Tutorial](https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-macos#0) from Ubuntu website will help you to guide. Essentially the same. 

If you like to stick with terminal these steps do , if not we have some open source alternatives. 

