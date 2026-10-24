<template>
  <header>
    <h1>{{ $t('app.title') }}</h1>
    <nav>
      <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
      <RouterLink to="/search">{{ $t('nav.search') }}</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>