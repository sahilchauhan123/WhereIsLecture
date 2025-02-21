

const colors = {
    primary: '#392AAB', // purple color
    secondary: '#6E6E6E', //grey
    background: '#023047', //A deep navy blue color.
    lightGrey:'#ABABAB',  //A cool cyan blue color.
    light: '#8ecae6',// A light sky blue color.
    text: '#000000',
    bggrey:'#F6F6F5',  //Standard black.
    placeholder: '#9CA3AF', //A neutral gray color for placeholders.
    white:"#FFFFFF" , //white
    orange:'#E87A30',
    grey:"#121212B2",
  };
  
  const fonts = {
    regular:'Poppins-Regular', // You can replace this with a custom font if you have one
    bold: 'Poppins-Bold',
    meduim:'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',// You can replace this with your bold custom font
    light:'Poppins-Light'
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    const date = new Date();
    const day = date.getDate(); // 21
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()]; // "Jan"
    const year = date.getFullYear(); // 2025


    const todayTime = {
      todayName,
      date,
      day,
      month,
      year,
    }

  export { colors, fonts,todayTime };