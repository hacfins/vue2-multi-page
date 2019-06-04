import ajax from '@/config/ajax'

/**
 * 获取课程列表
 */
export const getCourseList = data => ajax('/api/user/user/info', data, 'GET');

/**
 * 创建课程
 */

export const creatCourse = data => ajax('/api/user/user/info', data, 'POST');

/**
 * 编辑课程
 */
export const editCourse = data => ajax('/api/user/user/info', data, 'POST');