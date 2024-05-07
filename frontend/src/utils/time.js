export function getTodayDate() {
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
  
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const monthName = months[monthIndex];
    let day = today.getDate();
  
    // Добавляем ведущий ноль, если день меньше 10
    day = day < 10 ? '0' + day : day;
  
    // Возвращаем сегодняшнюю дату в формате 'день месяца год'
    return day + ' ' + monthName + ' ' + year;
  }



  