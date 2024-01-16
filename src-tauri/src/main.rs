// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[cfg(custom_protocol)]
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }
// use std::env;
use tauri::command;
// #[command]

// fn launch_exe() {
//     let exe_path: &str = "F://quick//pyExe//main//_.exe";
//     let current_dir = env::current_dir().expect("Failed to get current directory");
//     let full_path = current_dir.join(exe_path);
//     std::process::Command::new(full_path)
//         .spawn()
//         .expect("Failed to launch .exe file");
// }
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
// use std::process::Command;

// fn main() {
//     // 创建一个 Command 对象，指定要运行的可执行文件的路径
//     // 这里假设 main.exe 在当前目录下，你也可以用绝对路径或相对路径
//     let output = Command::new("F:\\quick\\pyExe\\JX\\main\\main.exe")
//         .output()
//         .expect("Failed to execute command");
//     // 执行 Command 对象，返回一个 Result 类型
//     // 如果成功，返回一个 Child 类型，表示子进程
//     // 如果失败，返回一个 io::Error 类型，表示错误原因
//     if output.status.success() {
//         let stdout = String::from_utf8_lossy(&output.stdout);
//         println!("Command executed successfully. Output: {}", stdout);
//     } else {
//         let stderr = String::from_utf8_lossy(&output.stderr);
//         println!("Command execution failed. Error: {}", stderr);
//     }
// }
