<template>
    <div>
        <nav>
            <h2>{{ $t('mypage.mypage') }}</h2>
            <ul>
                <li><router-link :to="{ name: 'myinfo' }">{{ $t('mypage.myinfo') }}</router-link></li>
                <li><router-link :to="{ name: 'mypromotion' }">{{ $t('mypage.mypromotion') }}</router-link></li>
                <li><router-link :to="{ name: 'myinvitee' }">{{ $t('mypage.myinvitee') }}</router-link></li>
                <li><router-link :to="{ name: 'myotp' }">{{ $t('mypage.myotp') }}</router-link></li>
            </ul>
        </nav>
        <router-view class="cnt"></router-view>
    </div>
</template>

<script>
export default {
    name: 'MypageNav',
}
</script>
