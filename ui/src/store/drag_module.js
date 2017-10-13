import {
  findNode
} from '../helper/soul_helper'
import {
  findElUpward
} from '../helper/dom_helper'
import {
  isPlain
}from '../util/assist'
import {
  deepCopy,
  getQueryParam
} from '../util/assist'
export default {
  namespaced: true,
  state: {
    dragElement: null,//当前被拖拽的元素
    soul: null,//展示用的组件树
    originSoul: null,//初始化soul
    pageSoul: {},//对应路由的soul
    showEditorPanel: false,
    editSoul: null,
    controlConfigs: null,
    editLayer: {}
  },
  getters: {
    editLayer({editLayer}){
      return editLayer
    },
    controlConfigs({controlConfigs}){
      return controlConfigs
    },
    appSoul({appSoul}){
      return appSoul
    },
    editSoul({editSoul}){
      return editSoul
    },
    getDragElement({dragElement}){
      return dragElement
    },
    soul({soul}){
      return soul
    },
    showEditorPanel({showEditorPanel}){
      return showEditorPanel;
    }
  },
  mutations: {
    clearEditLayer(state){
      state.editLayer= {
        style: {
          display:'none'
        }
      }
    },
    setEditLayer(state, bind){
      let rect = bind.el.getBoundingClientRect();
      state.editLayer = {
        style: {
          left: rect.left  + 'px',
          top: rect.top  + 'px',
          width: rect.width  + 'px',
          height: rect.height + 'px',
          display:'block'
        },
        name: bind.binding.value
      }
    },
    changeSoul(state, pagePath){
      let path = decodeURIComponent(getQueryParam('pageId'))

      if(!path) return

      if (!state.pageSoul[path]) {

        if(!state.originSoul) return

        const soulCopy = deepCopy(state.originSoul)
        state.pageSoul[path] = soulCopy
        state.soul = soulCopy
        return
      }
      state.soul = state.pageSoul[path]
    },
    setControlConfigs(state, controlConfigs){
      state.controlConfigs = controlConfigs
    },
    setAppSoul(state, appSoul){
      state.appSoul = appSoul
    },
    setDragElement(state, element){
      state.dragElement = element
    },
    setSoul(state, soul){
      state.soul = soul
    },
    setOriginSoul(state, soul){
      state.originSoul = deepCopy(soul)
      state.soul = state.pageSoul['/index'] = soul
    },
    showEditorPanel(state, e){

      e.stopPropagation()
      const el = findElUpward(e.target);
      const soul = findNode(el.controlConfig.uid, state.soul);
      if (!soul || !isPlain(soul.model)) {
        state.showEditorPanel = true
        state.editSoul = soul
        return true
      }

      state.showEditorPanel = false
      state.editSoul = null
    },
    hideEditorPanel(state, e){
      e.stopPropagation()
      state.showEditorPanel = false
    }
  },
  actions: {
    savePageSoul({state}){
      localStorage.setItem('pageSoul', JSON.stringify(state.pageSoul))
    }
  }
}
