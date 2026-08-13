import { supabase, handleSupabaseError } from './api'

export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    handleSupabaseError(error)
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    handleSupabaseError(error)
  }

  return data.user
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    handleSupabaseError(error)
  }

  return data.session
}

export async function forgotPassword({ email }) {
  const redirectTo = `${window.location.origin}/reset-password`

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export async function resetPassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    handleSupabaseError(error)
  }

  return data
}

export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })

  return subscription
}
