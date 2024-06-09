import ApiService from "./ApiService";

const api = new ApiService();

export function cureDate(date){
    date = new Date(date);
    const days = ['Domingo','Lunes,','Martes','Miércoles','Jueves','Viernes','Sábado']
    const weekDay = days[date.getDay()];
    const weekInitial = weekDay.substring(0, 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const y = year.toString().substring(2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return {
        weekDay,
        weekInitial,
        day,
        month,
        year,
        y,
        hours,
        minutes,
        seconds,
        fullDate: `${day}/${month}/${year} ${hours}:${minutes}`,
        ddMMyyyy: `${day}/${month}/${year}`,
        ddMMyy: `${day}/${month}/${y}`,
        ddMM: `${day}/${month}`,
        HHmm: `${hours}:${minutes}`,
    };
}

export async function getData(endpoint) {
    let data = {};
    let errorState = false;
    let loadingState = true;
    try {
        await api.get(endpoint,localStorage.getItem('token')).then(response => {
            if (response) {
                data = response;
            } else {
                console.error('sin respuesta');
            }
          }).catch(() => errorState = true);
    } catch (e) {
        console.error('Error al cargar las citas:', e);
        errorState = true;
    }
    loadingState = false;
    return [data,errorState,loadingState];
}

export function allowRoleAbove(userRole,requiredRole){
    if(!userRole){
        return false;
    }

    const userRoleLevel =
    userRole.includes('ROLE_ADMIN') ? 2 :
    userRole.includes('ROLE_AGENT') ? 1 : 0;

    return userRoleLevel >= requiredRole;
}

export function allowRoleEqual(userRole,requiredRole){
    if(!userRole){
        return false;
    }

    const userRoleLevel =
    userRole.includes('ROLE_ADMIN') ? 2 :
    userRole.includes('ROLE_AGENT') ? 1 : 0;

    return userRoleLevel === requiredRole;
}

export function getRoleType(userRole){
    const userRoleLevel =
    userRole.includes('ROLE_ADMIN') ? 2 :
    userRole.includes('ROLE_AGENT') ? 1 : 0;

    return userRoleLevel;
}