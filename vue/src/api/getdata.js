import ajax from '@/config/ajax'

/**
 * 获取课程列表
 */
export const getCourseList = data => ajax('/api/guest/common/courselist', data, 'GET');

/**
 * 创建课程
 */

export const creatCourse = data => ajax('/api/home/course/create', data, 'POST');

/**
 * 编辑课程
 */
export const editCourse = data => ajax('/api/home/course/modify', data, 'POST');