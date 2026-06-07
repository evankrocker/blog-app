---
layout: post
title: "Linux Command Line Essentials"
date: 2026-05-08
categories: [devops]
author: Evan Krocker
excerpt: "Mastering the Linux command line is a superpower for any developer. This guide covers the essential commands every developer should know."
---

The command line is an indispensable tool for developers. Whether you're managing servers, automating tasks, or navigating your filesystem, knowing your way around the terminal will make you significantly more productive.

## Navigation

```bash
pwd          # print working directory
ls -la       # list all files with details
cd /path     # change directory
mkdir mydir  # create directory
```

## File Operations

```bash
cp src dest        # copy file or directory
mv src dest        # move / rename
rm -rf dir         # remove recursively (careful!)
cat file           # print file contents
less file          # page through a file
grep -r "term" .   # search recursively
```

## Process Management

```bash
ps aux           # list all processes
kill -9 PID      # force kill a process
top              # real-time process monitor (htop is nicer)
command &        # run in background
jobs             # list background jobs
fg %1            # bring job 1 to foreground
```

## Networking

```bash
curl -I url        # fetch HTTP headers only
wget url           # download a file
netstat -tuln      # show listening ports
ss -tuln           # modern alternative to netstat
ssh user@host      # connect via SSH
scp file user@host:/path  # copy file over SSH
```

## Redirection and Pipes

```bash
command > file     # redirect stdout to file (overwrite)
command >> file    # redirect stdout (append)
command 2>&1       # redirect stderr to stdout
cmd1 | cmd2        # pipe output of cmd1 into cmd2
```

Mastering these fundamentals — especially pipes and redirection — unlocks a huge amount of power for scripting and automation.
