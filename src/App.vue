<script setup>
import { computed, onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue'

onMounted(() => document.title = 'Todo List App')

// dark mode
const darkMode = ref(JSON.parse(localStorage.getItem('darkMode')) || false)

watch(darkMode, newVal => {
  localStorage.setItem('darkMode', newVal)
}, { deep: true })

// Todo List
let inputTodo = ref('')

const todos = ref([])

// load todo
onMounted(() => {
  todos.value = JSON.parse(localStorage.getItem('todos')) || []
})

// add todo
const addTodo = () => {
  if(inputTodo.value != ''){

    todos.value.unshift({
      task: inputTodo.value,
      isDone: false,
      createdAt: Date.now()
    })

    inputTodo.value = ''
  }
}

watch(todos, newVal => {
  localStorage.setItem('todos', JSON.stringify(newVal))
}, { deep: true })

// update todo
const updateTodo = todo => {
  let index = todos.value.indexOf(todo)
  todos.value[index].isDone = !todos.value[index].isDone
}
  
// delete task
const deleteTask = todo => {
  todos.value = todos.value.filter(item => item !== todo)
}

// delete completed task
const deleteCompletedTask = () => {
  todos.value = todos.value.filter(item => item.isDone != true)
}

// filter task
const filter = ref('all')

const filterTodos = computed(() => {
  if(filter.value == 'active') {
    return todos.value.filter(item => item.isDone != true)
  } else if(filter.value == 'completed'){
    return todos.value.filter(item => item.isDone == true)
  } else {
    return todos.value
  }
})

// total items
const items = computed(() => {
  if(filter.value == 'active') {
    return todos.value.filter(item => item.isDone == false).length
  } else if(filter.value == 'completed'){
    return todos.value.filter(item => item.isDone == true).length
  } else {
    return todos.value.length
  }
})

</script>


<template>
  <div :class="{ dark : darkMode }">
    <div class="py-10 px-6 min-h-screen bg-[url('./assets/images/bg-mobile-light.jpg')] dark:bg-[url('./assets/images/bg-mobile-dark.jpg')] sm:bg-[url('./assets/images/bg-desktop-light.jpg')] sm:dark:bg-[url('./assets/images/bg-desktop-dark.jpg')] bg-no-repeat bg-[#f6f6f8] dark:bg-[#161722]">
      <div class="max-w-md mx-auto md:mt-10">
        <header>
          <div class="flex justify-between items-center">
            <a href="#">
              <h1 class="text-white font-bold text-xl md:text-3xl tracking-[.5em]">TODO</h1>
            </a>
            <div>          
              <button @click="darkMode = !darkMode">
                <span v-if="!darkMode">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6 fill-white text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                </span>
                <span v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6 fill-white text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </header>
        <section class="mt-6">
          <div class="space-y-4">

            <!-- input todo list -->
            <div class="grid grid-cols-12 w-full h-12 bg-white dark:bg-[#25273C] rounded-md">
              <div class="flex col-span-2 justify-center items-center">
                <div class="bg-transparent w-5 h-5 md:w-7 md:h-7 border border-gray-200 dark:border-[#4D5066] rounded-full"></div>
              </div>
              <input v-model="inputTodo" @keypress.enter="addTodo" type="text" placeholder="create a new todo..." class="col-span-8 text-xs md:text-base bg-transparent text-[#484B6A] dark:text-[#CACDE8] focus:outline-none placeholder:text-xs md:placeholder:text-base" autofocus>
            </div>

            <!-- todo list -->
            <div class="grid grid-cols-1 w-full bg-white dark:bg-[#25273C] rounded-md shadow-xl divide-y-2 dark:divide-[#393A4C]">

              <div v-if="filterTodos.length === 0" class="flex items-center justify-center h-12">
                <p class="text-xs md:text-base text-[#9394A5] dark:text-[#4D5066]">no task!</p>
              </div>

              <div v-for="todo in filterTodos" :key="todo.id" class="grid grid-cols-12 items-center h-12">
                
                <div class="flex col-span-2 justify-center items-center">
                  <button @click="updateTodo(todo)">
                    <div class="dark:border-[#4D5066] w-5 h-5 md:w-7 md:h-7 border border-gray-200 rounded-full" :class="[todo.isDone ? 'bg-blue-500' : 'bg-transparent']">
                      
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full text-white" v-if="todo.isDone">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>

                    </div>
                  </button>
                </div>
                
                <p class="col-span-8 text-xs md:text-base" :class="[todo.isDone ? 'line-through text-[#E4E5F1] dark:text-[#4D5066]' : 'text-[#484B6A] dark:text-[#CACDE8]']">{{ todo.task }}</p>
                
                <div class="flex col-span-2 justify-center items-center">
                  <button @click="deleteTask(todo)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 md:w-7 md:h-7 text-[#484B6A]">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
              </div>

              <!-- List Footer -->
              <div class="flex justify-between items-center h-12 text-xs md:text-sm text-[#9394A5] dark:text-[#4D5066] px-4">
                <p class="col-start-2">{{ items }} items left</p>
                <p class="col-span-6">
                  <button @click="deleteCompletedTask">Clear Completed</button>
                </p>
              </div>
            </div>

            <!-- filter todo list -->
            <div class="flex justify-center items-center gap-4 text-sm text-[#9394A5] dark:text-[#4D5066] font-bold w-full h-12 bg-white dark:bg-[#25273C] rounded-md shadow-xl">
              <button :class="{ 'text-[#3F7EFD]' : filter=='all' }" @click="filter = 'all'">All</button>
              <button :class="{ 'text-[#3F7EFD]' : filter=='active' }" @click="filter = 'active'">Active</button>
              <button :class="{ 'text-[#3F7EFD]' : filter=='completed' }" @click="filter = 'completed'">Completed</button>
            </div>
          </div>

          <p class="text-xs md:text-sm text-[#9394A5] text-center mt-10">Drag and drop to reorder list</p>
        </section>
      </div>
    </div>
  </div>
</template>