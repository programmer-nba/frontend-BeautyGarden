
<template>
    <div class="w-full">
    <div class="card">
        <Menubar class="rounded-xl shadow-lg" :model="items">
            <template #start>
    
            </template>
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex align-items-center" v-bind="props.action">
                    <span class="" :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                    <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                    <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
                </a>
            </template>
            <template #end>
                <Button icon="pi pi-sign-out text-red-400" class="text-red-400" label="ออกจากระบบ" @click="logout" />
            </template>
        </Menubar>
    </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const items = ref([
    {
        label: 'เอกสาร',
        icon: 'pi pi-folder',
        command: () => {
            router.push('/');
        }
    },
    {
        label: 'โปรไฟล์',
        icon: 'pi pi-id-card',
        command: () => {
            router.push('/company');
        }
    },
    {
        label: 'ลูกค้า',
        icon: 'pi pi-users',
        command: () => {
            router.push('/customers');
        },
        badge: 0
    },
    {
        label: 'ซัพพลายเออร์',
        icon: 'pi pi-shopping-cart',
        command: () => {
            router.push('/suppliers');
        },
        badge: 0
    },
    {
        label: 'บันทึกค่าใช้จ่าย',
        icon: 'pi pi-money-bill',
        command: () => {
            router.push('/pays');
        },
        badge: 0
    }
]);

const logout = () => {
    localStorage.clear()
    window.location.href = '/'
}
</script>