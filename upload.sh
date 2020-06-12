#!/usr/bin/expect  
set timeout 60  
set password liangzhi123
set prompt liangzhi@47.96.126.125              
spawn ssh liangzhi@47.96.126.125

expect {
  "(yes/no)?"
  {
    send "yes\n"
    expect "*password:" { send "$password\n"}
  }
  "*password:"
  {
    send "$password\n"
  }
}     
expect {
  "$ "
  {
    send "cd web_services/jxt_tianbao &&ls \r"
    expect {
      "$ " {
        send "rm -rf dist \r"
      }
    }
  }
}     
send "exit 0\r"

expect eof 

spawn scp -r /Users/daiping/jxt/dist/ liangzhi@47.96.126.125:/home/liangzhi/web_services/jxt_tianbao/
expect {
  "(yes/no)?"
  {
    send "yes\n"
    expect "*password:" { send "$password\n"}
  }
  "*password:"
  {
    send "$password\n"
  }
} 
expect eof 
