// 定义枚举类型，表明方法只能是get或者post，否者下面的method推断是any，传给router就会报错
export enum Methods {
    get = 'get',
    post = 'post'
}