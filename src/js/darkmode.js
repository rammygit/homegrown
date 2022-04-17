    if (localStorage.getItem('isDark') === 'true') {
      document.querySelector('body').classList.add("dark-theme");
    } else {
      document.querySelector('body').classList.remove("dark-theme");
    }



    const btn = document.getElementById('div_colorswitch');

    btn.addEventListener('click', (event) => {
      const isDark = document.querySelector('body').classList.toggle("dark-theme");

      localStorage.setItem('isDark', isDark)
    });

    // enable feather icons. 
    feather.replace()
