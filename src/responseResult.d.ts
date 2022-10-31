declare namespace ResponseResult{

    interface CourseItem {
        title: string;
        count: number;
    }
    interface ResData {
        [key: string]: CourseItem[]
    }

    type getData = object;
    type showData = ResData | object;
    type isLoginCheck = boolean;
    type logout = boolean;
    type login = object;
}